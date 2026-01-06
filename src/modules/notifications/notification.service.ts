import { prisma } from "../../config/prisma";

// Helper function to create match notification
const createMatchNotification = async (donorId: string, request: any): Promise<void> => {
  await prisma.notification.create({
    data: {
      userId: donorId,
      type: 'MATCH_FOUND',
      title: 'Blood Request Match Found!',
      message: `A patient in ${request.city} needs ${request.bloodGroup} blood. Your blood type matches!`,
      link: `/requests/${request.id}`
    }
  });
};

export const NotificationService = {
  createMatchNotification
};