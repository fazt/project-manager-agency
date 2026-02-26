import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { SubscriptionsService, SubscriptionPlan } from './subscriptions.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('subscriptions')
@Controller('subscriptions')
export class SubscriptionsController {
  constructor(private subscriptionsService: SubscriptionsService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get all subscription plans' })
  @ApiResponse({ status: 200, description: 'List of plans' })
  getPlans() {
    return this.subscriptionsService.getPlans();
  }

  @Get('current')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current subscription' })
  @ApiResponse({ status: 200, description: 'Current subscription' })
  async getCurrentSubscription(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.getCurrentSubscription(userId);
  }

  @Post('checkout')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create checkout session' })
  @ApiResponse({ status: 200, description: 'Checkout URL' })
  async createCheckout(
    @CurrentUser('id') userId: string,
    @Body('plan') plan: SubscriptionPlan,
  ) {
    return this.subscriptionsService.createCheckoutSession(userId, plan);
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel subscription' })
  @ApiResponse({ status: 200, description: 'Subscription cancelled' })
  async cancelSubscription(@CurrentUser('id') userId: string) {
    return this.subscriptionsService.cancelSubscription(userId);
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Stripe webhook endpoint' })
  async handleWebhook(@Req() req: RawBodyRequest<Request>) {
    return this.subscriptionsService.handleWebhook(req.body);
  }
}
