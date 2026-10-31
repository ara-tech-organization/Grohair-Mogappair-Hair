/**
 * SINGLE PLACE TO EDIT BUSINESS DETAILS AND THE FORM API.
 * Values below were taken from https://adgrohairclinicmogappair.com/skin-clinic/
 */
export const CLINIC = {
  name: 'Advanced GroHair & GloSkin',
  shortName: 'AdGro Hair & GloSkin',
  area: 'Mogappair, Chennai',
  address: 'No.8, 2nd floor, Bharathi Salai, above Polar Bear ice cream, Mogappair West, Ambattur Industrial Estate, Chennai, Tamil Nadu 600037',
  phone: '+918270956789',
  phoneDisplay: '+91 82709 56789',
  email: 'mogappair@adgrohair.com',
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=Advanced%20GroHair%20%26%20GloSkin%20Clinic%20-%20Mogappair',
  mapEmbedUrl: 'https://maps.google.com/maps?q=Advanced%20GroHair%20%26%20GloSkin%20Clinic%20-%20Mogappair&t=m&z=15&output=embed&iwloc=near',
  privacyUrl: '',   // TODO existing privacy policy URL (hidden while empty)
  siteUrl: 'https://adgrohairclinicmogappair.com',
};

// Patient reviews from the Mogappair site (hair-related ones).
export const REVIEWS = [
  { name: 'Sumanth Ravi', tag: 'Hair fall patient', text: 'I consulted Dr Nikitha for my hair fall problem. She explained everything and suggested the best treatment. This is my 4th session and I have visible results. Much recommended!' },
  { name: 'Arun Viran', tag: 'GroHair client', text: "I had a great experience with hair treatment in this clinic. I'll recommend the clinic and the doctors to everyone. Very hygienic and well maintained." },
];

// Options for the single-select "Hair concern" dropdown.
export const HAIR_CONCERNS = ['Hair fall', 'Thinning or bald patches', 'Dandruff', 'Hair transplant'];

export const FORM = {
  // Same endpoint the Mogappair site posts to (JSON body).
  apiUrl: 'https://adgrohairclinicmogappair.com/api/mail.php',
  format: 'json',
  // Where to go after success. Empty = show inline success message.
  thankYouPath: '', // e.g. '/thank-you'
  // Same fields as the reference site: name, phone, city, treatment, source.
  // `treatment` carries the selected hair concern.
  buildPayload: (v) => ({
    name: v.name,
    phone: v.phone,
    city: v.city,
    treatment: v.concern,
    source: 'Grohair Mogappair Hair Landing Page',
  }),
  // Reference site treats the response as success when it is ok and (non-JSON or success/email_sent/sheet_saved).
  isSuccess: (res, json) => res.ok && (!json || json.success || json.email_sent || json.sheet_saved),
  gtmEvent: 'lead_form_submitted',
};
