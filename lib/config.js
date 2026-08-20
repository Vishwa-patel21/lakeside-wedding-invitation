export const weddingConfig = {
  couple: {
    bride: "Bride",
    groom: "Groom",
    initials: "B & G",
    story:
      "A small story of us, our families, and the moments that brought us here. Add your favorite couple photos here to make this invitation feel personal.",
    photos: [
      {
        src: "",
        title: "Our Beginning",
        alt: "First couple photo"
      },
      {
        src: "",
        title: "Favorite Memory",
        alt: "Second couple photo"
      },
      {
        src: "",
        title: "Together",
        alt: "Third couple photo"
      }
    ]
  },
  date: {
    display: "Saturday, September 5, 2026",
    iso: "2026-09-05T15:00:00-04:00",
    time: "3:00 PM"
  },
  venue: {
    name: "Northern Water Sports Centre",
    line1: "Sudbury, Ontario",
    line2: "By Bell Park and Ramsey Lake",
    mapUrl: "https://www.google.com/maps/search/?api=1&query=Northern%20Water%20Sports%20Centre%20Sudbury"
  },
  invitation: {
    headline: "Together with their families",
    message:
      "We invite you to celebrate a beautiful lakeside beginning filled with love, laughter, food, music and memories."
  },
  rsvp: {
    phoneNumber: "+1 000 000 0000",
    whatsappMessage:
      "Hello, I would love to RSVP for the wedding celebration."
  },
  contacts: [
    {
      name: "Family Contact",
      role: "RSVP and guest questions",
      phone: "+1 000 000 0000",
      note: "Call or message for timing, food notes or guest details."
    },
    {
      name: "Photo Help",
      role: "Guest photo uploads",
      phone: "+1 000 000 0000",
      note: "Message if the upload link or QR code is not working."
    }
  ],
  schedule: [
    { time: "3:00 PM", title: "Guest Arrival", detail: "Welcome by the lake" },
    { time: "3:30 PM", title: "Couple Entrance", detail: "Golden arch moment" },
    { time: "4:00 PM", title: "Photos", detail: "Family and friends" },
    { time: "5:00 PM", title: "Dinner", detail: "Vegetarian celebration meal" },
    { time: "6:30 PM", title: "Music & Games", detail: "A joyful evening together" }
  ],
  photos: {
    uploadPath: "/photos",
    bucket: "wedding-photos"
  }
};
