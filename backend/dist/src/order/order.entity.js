"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
var typeorm_1 = require("typeorm");
var curier_entity_1 = require("../curier/curier.entity");
var goods_entity_1 = require("../goods/goods.entity");
var user_entity_1 = require("../user/user.entity");
var order_goods_entity_1 = require("./order-goods.entity");
var Order = /** @class */ (function () {
    function Order() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)("uuid"),
        __metadata("design:type", String)
    ], Order.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return user_entity_1.User; }, function (user) { return user.orders; }, { onDelete: "SET NULL", nullable: true }),
        __metadata("design:type", user_entity_1.User)
    ], Order.prototype, "user", void 0);
    __decorate([
        (0, typeorm_1.ManyToMany)(function () { return goods_entity_1.Goods; }, function (goods) { return goods.orders; }),
        (0, typeorm_1.JoinTable)({
            name: "order_goods",
            joinColumn: { name: "order_id", referencedColumnName: "id" },
            inverseJoinColumn: { name: "goods_id", referencedColumnName: "id" },
        }),
        __metadata("design:type", Array)
    ], Order.prototype, "goods", void 0);
    __decorate([
        (0, typeorm_1.OneToMany)(function () { return order_goods_entity_1.OrderGoods; }, function (orderGoods) { return orderGoods.order; }),
        __metadata("design:type", Array)
    ], Order.prototype, "orderToGoods", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "with_delivery", default: false }),
        __metadata("design:type", Boolean)
    ], Order.prototype, "withDelivery", void 0);
    __decorate([
        (0, typeorm_1.Column)(),
        __metadata("design:type", Number)
    ], Order.prototype, "price", void 0);
    __decorate([
        (0, typeorm_1.Column)({ name: "done", default: false }),
        __metadata("design:type", Boolean)
    ], Order.prototype, "done", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return curier_entity_1.Curier; }, function (curier) { return curier.orders; }, { onDelete: "SET NULL", nullable: true }),
        (0, typeorm_1.JoinColumn)({ name: "curier_id" }),
        __metadata("design:type", curier_entity_1.Curier)
    ], Order.prototype, "curier", void 0);
    __decorate([
        (0, typeorm_1.CreateDateColumn)(),
        __metadata("design:type", Date)
    ], Order.prototype, "created_at", void 0);
    __decorate([
        (0, typeorm_1.UpdateDateColumn)(),
        __metadata("design:type", Date)
    ], Order.prototype, "updated_at", void 0);
    Order = __decorate([
        (0, typeorm_1.Entity)({ name: "orders" })
    ], Order);
    return Order;
}());
exports.Order = Order;
