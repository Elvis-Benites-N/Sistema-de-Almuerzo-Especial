export interface ResponseAPI<E = {}> {
  message: string;
  data?: E;
}
