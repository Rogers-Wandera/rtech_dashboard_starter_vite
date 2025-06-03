import { Notification } from "@/types/notifications/notification.types";

export const notifications_data: Notification[] = [
  {
    id: "1",
    title: "New Message from Alex Johnson",
    message: "Regarding the project timeline and upcoming deadlines",
    type: "unread",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    sender: {
      name: "Alex Johnson",
      avatar: "https://i.pravatar.cc/150?img=5",
    },
    imageUrl: "https://images.unsplash.com/photo-1628890923662-2cb23c2e0cfe",
    body: `
          <p>Hey there!</p>
          <p>I wanted to follow up on our project timeline. We need to adjust some deadlines based on the client's new requirements.</p>
          <p>Can we schedule a meeting for tomorrow to discuss this? I've attached the updated project brief for your reference.</p>
          <p>Best regards,<br/>Alex</p>
        `,
    actions: [
      {
        label: "Reply",
        onClick: () => console.log("Reply clicked"),
        variant: "primary",
      },
      {
        label: "Schedule Meeting",
        onClick: () => console.log("Schedule clicked"),
      },
    ],
  },
  {
    id: "2",
    title: "Document Delivery Confirmation",
    message: "Your file has been successfully delivered to the client",
    type: "sent",
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    videoUrl:
      "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
    body: `
          <p>The final project deliverables have been sent to the client as of 30 minutes ago.</p>
          <p>Client: Acme Corporation<br/>
          Files: Project_Final_Deliverables.zip (45.2 MB)<br/>
          Recipient: sarah.miller@acme.com</p>
          <p>You can view the delivery confirmation video attached.</p>
        `,
  },
  {
    id: "3",
    title: "URGENT: Critical System Maintenance",
    message: "Emergency maintenance scheduled for tonight at 11PM",
    type: "urgent",
    timestamp: new Date(Date.now() - 1000 * 60 * 120),
    body: `
          <p><strong>Attention all team members:</strong></p>
          <p>We need to perform emergency maintenance on our production systems tonight to address a critical security vulnerability.</p>
          <p><strong>Maintenance Window:</strong> 11:00 PM - 1:00 AM (2 hours)</p>
          <p><strong>Impact:</strong> All systems will be unavailable during this window.</p>
          <p>Please save all work and log out before the maintenance begins.</p>
        `,
    actions: [
      {
        label: "Acknowledge",
        onClick: () => console.log("Acknowledged"),
        variant: "primary",
      },
      {
        label: "View Details",
        onClick: () => console.log("Details clicked"),
      },
    ],
  },
  {
    id: "4",
    title: "System Update Completed",
    message: "Version 2.3.0 has been successfully deployed",
    type: "system",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    body: `
          <p>The latest system update (v2.3.0) has been successfully deployed to production.</p>
          <p><strong>New Features:</strong></p>
          <ul>
            <li>Enhanced notification system</li>
            <li>Improved dashboard performance</li>
            <li>New reporting tools</li>
          </ul>
          <p>Please report any issues to the support team.</p>
        `,
  },
  {
    id: "5",
    title: "Weekly Team Meeting Reminder",
    message: "Don't forget about our weekly sync tomorrow at 10AM",
    type: "read",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    sender: {
      name: "Team Calendar",
    },
    body: `
          <p>This is a reminder about our weekly team meeting tomorrow at 10:00 AM in Conference Room B.</p>
          <p><strong>Agenda:</strong></p>
          <ul>
            <li>Project updates</li>
            <li>Q2 planning</li>
            <li>Team feedback</li>
          </ul>
        `,
  },
];
