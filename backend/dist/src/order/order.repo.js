"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderGoodsRepo = exports.orderRepo = void 0;
var data_source_1 = require("../core/connection/data-source");
var order_goods_entity_1 = require("./order-goods.entity");
var order_entity_1 = require("./order.entity");
exports.orderRepo = data_source_1.AppDataSource.getRepository(order_entity_1.Order);
exports.orderGoodsRepo = data_source_1.AppDataSource.getRepository(order_goods_entity_1.OrderGoods);
