import {environment} from '../../../environments/environment';

export const APIRoutes = {
  ROOT: environment.domain,
  SIGNUP_USER: `api/auth/login`,
  LIST_ROLES: `api/roles`,
  REGISTER: `api/auth/registrar`,
  LINKS: `links`,
  NAVES: `api/naves`,
  MY_NAVES: `api/naves/list/`,
  PASAJERO: `api/pasaje`,
  MY_PASAJES: `api/pasaje/list/`,
  MY_PROFILE: `api/usuarios`,
  USER: `api/usuarios`,
  NEWS: `/servicios/noticias`,
  PROGRAM_INTERES: `/servicios/programas`,
};
