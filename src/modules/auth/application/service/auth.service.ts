import { Inject, Injectable } from '@nestjs/common';

import { CreateUserDto } from '@/modules/user/application/dto/create-user.dto';
import { UserService } from '@/modules/user/application/service/user.service';
import { Role } from '@/modules/user/domain/format.enum';
import { User } from '@/modules/user/domain/user.domain';

import { SignUpDto } from '../dto/sign-up.dto';
import { AUTH_ERRORS, UserAlreadyExistsError } from '../exception/auth.error';
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
    const user = await this.userService.findOneByEmail(signUpDto.email);
    if (user) {
      throw new UserAlreadyExistsError(AUTH_ERRORS.USER_ALREADY_EXISTS);
    }

    const signUpParams: ISignUpParams = {
      email: signUpDto.email,
      password: signUpDto.password,
    };
    const externalId = await this.authProviderService.signUp(signUpParams);

    const createUserDto: CreateUserDto = {
      ...signUpDto,
      externalId,
      role: Role.CLIENT,
    };

    return await this.userService.create(createUserDto);
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
