import moment from "moment";
import {ADMIN_ROLES, MANAGER_ROLES} from "../graphql/types";

export const randomKeys = (length: number = 7): string => {
  return Math.random().toString(36).substring(length);
}

export const getInitialName = (firstName: string): string => {
  if (!firstName || firstName === "") return "";

  const names: string[] = firstName.split(" ");
  const initial: string = names.length === 1
    ? names[0].charAt(0)
    : `${names[0].charAt(0)}${names[1].charAt(0)}`;

  return initial;
}

export const formatDate = (date: string, type="ll"): string => {
  return moment(date).format(type);
}

export const validURL = (str: string) => {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
};

export const formatBytes = (bytes: number, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const downloadURI = (uri:string, name:string) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = uri;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const downloadFile = (url: string, name: string) => {
  fetch(url)
    .then(res => {
      return res.blob();
    }).then(blob => {
      const href = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = name;
      link.href = href;
      link.href = '';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }).catch(err => console.error(err));
}

export const getUserRole = (roles: {role: string, product: string}[], product: any) => {
  roles = roles.filter(r => r.product === product);
  return roles.map(r => r.role);
}

export const hasManagerRoots = (userRoles: string[]) => MANAGER_ROLES.some(r=> userRoles.includes(r));
export const hasAdminRoots = (userRoles: string[]) => ADMIN_ROLES.some(r=> userRoles.includes(r));
