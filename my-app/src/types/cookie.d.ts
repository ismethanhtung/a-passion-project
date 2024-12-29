declare module "cookie" {
    export function parse(cookieHeader: string, options?: any): { [key: string]: string };
    export function serialize(name: string, value: string, options?: any): string;
}
