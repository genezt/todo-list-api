interface IDescription_route {
  method: string,
  path: string;
  handler: (req, res) => Express.Response
}


export type Description_Route = Readonly<IDescription_route>
