import { Inject, Injectable } from '@nestjs/common';

import { CreateUserDto } from '@/modules/user/application/dto/create-user.dto';
import { UserService } from '@/modules/user/application/service/user.service';
import { Role } from '@/modules/user/domain/format.enum';
import { User } from '@/modules/user/domain/user.domain';

import { SignUpDto } from '../dto/sign-up.dto';
import {
  AUTH_PROVIDER_SERVICE,
  IAuthProviderService,
  IConfirmPasswordParams,
  IForgotPasswordParams,
  ISignInParams,
  ISignUpParams,
  ITokenGroup,
} from '../interface/auth-provider.service.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_PROVIDER_SERVICE)
    private readonly authProviderService: IAuthProviderService,
    private readonly userService: UserService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const signUpParams: ISignUpParams = {
      email: signUpDto.email,
      password: signUpDto.password,
    };
    const createUserDto: CreateUserDto = {
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
      email: signUpDto.email,
      dob: signUpDto.dob,
      address: signUpDto.address,
      country: signUpDto.country,
      role: Role.CLIENT,
    };

    const externalId = await this.authProviderService.signUp(signUpParams);

    return await this.userService.create(createUserDto, externalId);
  }

  async signIn(signInParams: ISignInParams): Promise<ITokenGroup> {
    return await this.authProviderService.signIn(signInParams);
  }

  async forgotPassword(
    forgotPasswordParams: IForgotPasswordParams,
  ): Promise<string> {
    return await this.authProviderService.forgotPassword(forgotPasswordParams);
  }

  async confirmPassword(
    confirmPasswordParams: IConfirmPasswordParams,
  ): Promise<boolean> {
    return await this.authProviderService.confirmPassword(
      confirmPasswordParams,
    );
  }
}
