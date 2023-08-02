export interface IBodyInput {
  scriptText: string;
  avatar: string;
  background: string;
  title: string;
  description?: string;
  visibility?: string;
  avatarSettings?: {
    voice?: string;
    style?: string;
  }
}

export interface IRequestBody {
  test?: boolean;
  input: [IBodyInput];
}
