import { NextResponse } from 'next/server';

export default function GET(req, res) {
  const response = NextResponse.json({ message: 'Hello, World!' });
  console.log("sanjai")
  return response;
}