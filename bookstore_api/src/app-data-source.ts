import { DataSource } from "typeorm";

export const dataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    database: 'BookStore',
    entities: ['bookstore_api/src/entity/*.ts'],
    logging: false,
    synchronize: true,
})