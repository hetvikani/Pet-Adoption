import { Controller, Get, Patch, Param, UseGuards, Req, NotFoundException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification, NotificationDocument } from '../schemas/notification.schema';

@Controller('notifications')
export class NotificationsController {
  constructor(
    @InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getNotifications(@Req() req) {
    const notifications = await this.notificationModel
      .find({ recipient: req.user._id })
      .populate('relatedPet', 'name photos species')
      .sort({ createdAt: -1 })
      .limit(20);

    const unreadCount = await this.notificationModel.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    return {
      success: true,
      unreadCount,
      data: notifications,
    };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id/read')
  async markAsRead(@Req() req, @Param('id') id: string) {
    const notification = await this.notificationModel.findOneAndUpdate(
      { _id: id, recipient: req.user._id },
      { read: true },
      { new: true },
    );

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    return { success: true, data: notification };
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('mark-all-read')
  async markAllRead(@Req() req) {
    await this.notificationModel.updateMany(
      { recipient: req.user._id, read: false },
      { read: true },
    );
    return { success: true, message: 'All notifications marked as read' };
  }
}
