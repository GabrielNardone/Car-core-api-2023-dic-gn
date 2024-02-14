import {
  AuthenticationResultType,
  CodeDeliveryDetailsType,
} from '@aws-sdk/client-cognito-identity-provider';
import { Body, Controller, Post } from '@nestjs/common';

import { ConfirmPasswordDto } from '../application/dto/confirm-password.dto';
import { ForgotPasswordDto } from '../application/dto/forgot-password.dto';
import { SignInDto } from '../application/dto/sign-in.dto';
import { SignUpDto } from '../application/dto/sign-up.dto';
import { AuthService } from '../application/service/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto): Promise<string> {
    return await this.authService.signUp(signUpDto);
  }

  @Post('sign-in')
  async signIn(
    @Body() signInDto: SignInDto,
  ): Promise<AuthenticationResultType> {
    return await this.authService.signIn(signInDto);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<CodeDeliveryDetailsType> {
    return await this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('confirm-password')
  async confirmPassword(
    @Body() confirmPasswordDto: ConfirmPasswordDto,
  ): Promise<boolean> {
    return await this.authService.confirmPassword(confirmPasswordDto);
  }
}
