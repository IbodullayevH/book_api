export class CreateOrderDto {
    userId: number;

    bookIds: number[];

    totalPrice: number;

    status?: string;
}
