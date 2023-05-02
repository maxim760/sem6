import { yupResolver } from '@hookform/resolvers/yup'
import { Box, Grid } from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FC } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { EditGoodsDiscountDto } from 'src/api/services/goods/dto'
import { goodsApi } from 'src/api/services/goods/goodsService'
import { IGoods } from 'src/api/services/goods/response'
import { CloseButton } from 'src/components/ui/buttons/CloseButton'
import { SaveButton } from 'src/components/ui/buttons/SaveButton'
import { AppDialog } from 'src/components/ui/dialogs/AppDialog'
import { Input } from 'src/components/ui/form/Input'
import { FormFields, getSchema } from 'src/utils/config/forms'
import { DialogProps } from 'src/utils/types/types'

type EditGoodsDiscount = Omit<EditGoodsDiscountDto, "id">

const getValidationSchema = () =>
  getSchema<EditGoodsDiscount>({
    discount: FormFields.RequiredNumberPercent
  })

type IProps = {
  invalidateQuery: string,
  id: string
  item?: IGoods
} & DialogProps

export const EditDiscount: FC<IProps> = ({ onClose, open, invalidateQuery, item, id }) => {
  const queryClient = useQueryClient()
  const { mutate, isLoading } = useMutation({
    mutationFn: goodsApi.editDiscount,
    onSuccess: () => {
      queryClient.invalidateQueries([invalidateQuery])
      onClose()
    },
  })
  const methods = useForm<EditGoodsDiscount>({
    resolver: yupResolver(getValidationSchema()),
    defaultValues: {discount: item?.discount},
  })
  const { handleSubmit } = methods
  const onSubmit = (data: EditGoodsDiscount) => {
    mutate({...data, id})
  }
  return (
    <AppDialog onClose={onClose} open={open} title="Измените скидку" maxWidth="xs" fullWidth>
      <FormProvider {...methods}>
        <Grid
          container
          component="form"
          spacing={1}
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid item xs={12}>
            <Input label="Процент скидки" name="discount" type="number" />
          </Grid>
          <Grid item xs={12}>
            <Box display="flex">
              {!!onClose && (
                <CloseButton
                  onClick={onClose}
                  sx={{ mt: 1, ml: 'auto', display: 'flex', mr: 1 }}
                />
              )}
              <SaveButton
                type="submit"
                sx={{
                  mt: 1,
                  mx: !onClose ? 'auto' : undefined,
                  display: 'flex',
                }}
                loading={isLoading}
              />
            </Box>
          </Grid>
        </Grid>
      </FormProvider>
    </AppDialog>
  )
}
