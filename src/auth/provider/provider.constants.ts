import {BaseOAuthService} from "@/auth/provider/services/base-oauth.service";
import {FactoryProvider, ModuleMetadata} from "@nestjs/common";

export const ProviderOptionsSymbol = Symbol()
//символ для идентификации параметров провайдера
//тип для синхронных параметров модуля
export type TypeOptions = {
    baseUrl: string
    services: BaseOAuthService[]
}

export type TypeAsyncOptions =
    Pick<ModuleMetadata, 'imports'>
    & Pick<FactoryProvider<TypeOptions>, 'useFactory' | 'inject'>
