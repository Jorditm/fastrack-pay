import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function encryptData(string: string) {
  const cipher = crypto.createCipheriv(
    process.env.ENCRYPTION_METHOD!,
    process.env.ENCRYPTION_KEY!,
    process.env.ENCRYPTION_IV!
  )
  return Buffer.from(
    cipher.update(string, 'utf8', 'hex') + cipher.final('hex')
  ).toString('base64')
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  if (!data.string) {
    return NextResponse.json(
      { error: 'No string provided' },
      { status: 400 }
    )
  }
  const encryptedString = encryptData(data.string)
  return NextResponse.json(
    {
      encryptedString: encryptedString
    },
    { status: 200 }
  )
}
