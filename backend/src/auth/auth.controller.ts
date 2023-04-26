import { NextFunction, Request, Response } from "express";
import { ITokens, IUserPayload, TypedRequestBody, TypedRequestQuery, UserRole } from "../core/types";
import { Role } from "../role/role.entity";
import { roleRepo } from "../role/role.repo";
import { User } from "../user/user.entity";
import { userRepo } from "../user/user.repo";
import { CreateUserDto } from "./dto/create-user.dto";
import bcrypt from "bcrypt"
import {Like, Raw, ILike} from "typeorm"
import { addressRepo } from "../address/address.repo";
import { LoginUserDto } from "./dto/login-user.dto";
import passport from "passport";
import { TokenService } from "../core/utils/tokens";
import { UpdateUserCashDto } from "./dto/update-user-cash.dto";
import { UpdateUserContantDto } from "./dto/update-user-contact.dto";
import { UpdateUserAddressDto } from "./dto/update-user-address.dto";
import { FindUsersDto } from "./dto/find-users-dto";

class AuthController {
  async registration(req: TypedRequestBody<CreateUserDto>, res: Response) {
    try {
      const { user: { password, ...userData }, address: addressBody } = req.body;
      const userWithEmail = await userRepo.findOneBy({ email: userData.email })
      if (userWithEmail) {
        return res.status(500).json({message: "Пользователь с таким email уже существует"})
      }
      const user = userRepo.create(userData)
      user.cash = 0

      const roles: Role[] = []
      let userRole = await roleRepo.findOneBy({ name: UserRole.User });
      if (!userRole) {
        userRole = roleRepo.create({ name: UserRole.User })
        await roleRepo.save(userRole)
      }
      roles.push(userRole)
      if (userData.email.includes("@admin")) {
        let adminRole = await roleRepo.findOneBy({ name: UserRole.Admin });
        if (!adminRole) {
          adminRole = roleRepo.create({ name: UserRole.Admin })
          await roleRepo.save(adminRole)
        }
        roles.push(adminRole)
      }
      user.roles = roles
      if (!password) {
        user.password = ""
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt)
        user.password = hashedPass
      }

      const address = addressRepo.create(addressBody)
      await addressRepo.save(address)
      user.address = address
      await userRepo.save(user)
    
      return res.json({ user: {email: user.email} });
    } catch (e) {
      return res.status(500).json({ message: 'Не удалось создать пользователя.' })
    }
  }
  // todo - повыносить в сервисы логику
  async registrationOauth2(req: TypedRequestBody<CreateUserDto>, res: Response) {
    try {
      const { user: { password, ...userData }, address: addressBody } = req.body;
      const userWithEmail = await userRepo.findOneBy({ email: userData.email })
      if (userWithEmail) {
        return res.status(500).json({message: "Пользователь с таким email уже существует"})
      }
      const user = userRepo.create(userData)
      user.cash = 0

      const roles: Role[] = []
      let userRole = await roleRepo.findOneBy({ name: UserRole.User });
      if (!userRole) {
        userRole = roleRepo.create({ name: UserRole.User })
        await roleRepo.save(userRole)
      }
      roles.push(userRole)
      if (userData.email.includes("@admin")) {
        let adminRole = await roleRepo.findOneBy({ name: UserRole.Admin });
        if (!adminRole) {
          adminRole = roleRepo.create({ name: UserRole.Admin })
          await roleRepo.save(adminRole)
        }
        roles.push(adminRole)
      }
      user.roles = roles
      if (!password) {
        user.password = ""
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(password, salt)
        user.password = hashedPass
      }

      const address = addressRepo.create(addressBody)
      await addressRepo.save(address)
      user.address = address
      await userRepo.save(user)
      const payload: IUserPayload = { id: user.id, email: user.email, roles: user.roles.map(item => item.name) };
      const newTokens = TokenService.generateTokens(payload)
      user.refreshToken = newTokens.refreshToken
      await userRepo.save(user)
      res.cookie('refreshToken', newTokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json({ user: user.toJSON() });
    } catch (e) {
      return res.status(500).json({ message: 'Не удалось создать пользователя.' })
    }
  }

  async login(req: TypedRequestBody<LoginUserDto>, res: Response, next: NextFunction) {
    passport.authenticate('local', async (err, user: User, info) => {
      if (err || !user) {
        return res.status(401).json({ message: 'Неправильные email или пароль.', login: true });
      }
      const payload: IUserPayload = { id: user.id, email: user.email, roles: user.roles.map(item => item.name) };
      const newTokens = TokenService.generateTokens(payload)
      user.refreshToken = newTokens.refreshToken
      await userRepo.save(user)
      res.cookie('refreshToken', newTokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
      return res.json({ user: user.toJSON(), accessToken: newTokens.accessToken });
    })(req, res, next);
  }

  async logout(req: Request, res: Response) {
    res.clearCookie('refreshToken')
    const user = await userRepo.findOneBy({ id: req.user?.id || "" })
    if (user) {
      user.refreshToken = ""
      await userRepo.save(user)
    }
    res.json({success: true})
  }
  // проверить, работает ли везде toJSON
  async refresh(req: Request, res: Response) {
    const data = req.user as { tokens: ITokens, user: User }
    res.json({user: data?.user?.toJSON?.(), accessToken: data.tokens.accessToken})
  }

  async oauthCallback(req: Request, res: Response) {
    console.log("oauth starts")
    if ((req.user as any)?.tokens) {
      res.cookie('refreshToken', (req.user as any).tokens.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true})
    }
    
    res.send(`
      <script>
        window.opener.postMessage(${JSON.stringify({ user: {...req.user, accessToken: req.user?.tokens?.accessToken || "" }, type: "oauth2" })}, '*');
        window.close();
      </script>
    `);
  }
  async me(req: Request, res: Response) {
    if (!req.user) {
      return res.status(401).json({data: null})
    }
    const user = await userRepo.findOne({ where: { email: req.user.email }, relations: { address: true, roles: true } })
    if (!user) {
      return res.status(404).json({data: null, message: "Информация о пользователе не найдена"})
    }
    res.json(user.toJSON())
  }
  async updateUserCash(req: TypedRequestBody<UpdateUserCashDto>, res: Response) {
    const id = req.user?.id
    const user = await userRepo.findOneBy({ id })
    if (!user) {
      return res.status(404).json({data: null, message: "Информация о пользователе не найдена"})
    }
    await userRepo.update({ id }, { cash: () => `cash + ${req.body.cash}` })
    return res.json({data: true})
  }
  async updateUserContact(req: TypedRequestBody<UpdateUserContantDto>, res: Response) {
    const id = req.user?.id
    const user = await userRepo.findOneBy({ id })
    if (!user) {
      res.status(404).json({data: null, message: "Информация о пользователе не найдена"})
    }
    await userRepo.update({ id }, req.body)
    return res.json({data: true})
  }
  async updateUserAddress(req: TypedRequestBody<UpdateUserAddressDto>, res: Response) {
    const id = req.user?.id
    const user = await userRepo.findOne({ where: { id }, relations: {address: true}})
    if (!user) {
      return res.status(404).json({data: null, message: "Информация о пользователе не найдена"})
    }
    const result = await addressRepo.update({ id: user.address.id }, {...user?.address, ...req.body})
    return res.json({data: true})
  }

  async getAllUsers(req: TypedRequestQuery<FindUsersDto>, res: Response) {
    const {query = ""} = req.query
    const users = await userRepo.find({
      where: [
        {firstName: ILike(`%${query}%`)},
        {lastName: ILike(`%${query}%`)},
        {phone: ILike(`%${query}%`)},
      ]
    })
    if (!users) {
      return res.status(404).json({data: null, message: "Информация о пользователе не найдена"})
    }
    return res.json(users.map(user => user.toJSON()))
  }

  async deleteUser(req: Request, res: Response) {
    const id = req.user?.id
    const user = await userRepo.findOne({ where: { id }})
    if (!user) {
      return res.status(404).json({data: null, message: "Информация о пользователе не найдена"})
    }
    userRepo.delete([id])
    res.json({data: 1})
  }

}
export default new AuthController