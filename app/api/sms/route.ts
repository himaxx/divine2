import { NextRequest, NextResponse } from 'next/server';
import { Vonage } from '@vonage/server-sdk';

const vonage = new Vonage({
  apiKey: "5723f1b4",
  apiSecret: "q2LQVglBGGz3lCQS"
});

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, city, area, loanType, documents, description } = await req.json();
    const from = "Vonage APIs";
    const to = "+916267888249"; // Always send to admin
    const text = `New Loan Enquiry\n----------------------\nName: ${name}\nPhone: ${phone}\nEmail: ${email || '-'}\nCity: ${city || '-'}\nArea: ${area || '-'}\nLoan Type: ${loanType || '-'}\nDocuments: ${(documents && documents.length) ? documents.join(', ') : '-'}\nDescription: ${description || '-'}`;
    const resp = await vonage.sms.send({ to, from, text });
    return NextResponse.json({ success: true, resp });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || err.toString() }, { status: 500 });
  }
} 