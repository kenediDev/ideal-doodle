import { createTransport, Transporter } from 'nodemailer';
import { __process__, __test__ } from './env';

export const Transpoter = async (): Promise<Transporter> => {
  let transpoter: Transporter = createTransport({
    host: __process__.smtp_host,
    port: parseInt(__process__.smtp_port),
    secure: false,
    auth: {
      user: __process__.smtp_user,
      pass: __process__.smtp_pass,
    },
  });
  return transpoter;
};
