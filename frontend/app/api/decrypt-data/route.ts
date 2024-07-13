import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'

function decryptData(encryptedString: string) {
  const buff = Buffer.from(encryptedString, 'base64')
  const decipher = crypto.createDecipheriv(
    process.env.ENCRYPTION_METHOD!,
    process.env.ENCRYPTION_KEY!,
    process.env.ENCRYPTION_IV!
  )
  return (
    decipher.update(buff.toString('utf8'), 'hex', 'utf8') +
    decipher.final('utf8')
  )
}

export async function POST(req: NextRequest) {
  const data = await req.json()
  if (!data.encriptedString) {
    return NextResponse.json(
      { error: 'No encrypted string provided' },
      { status: 400 }
    )
  }
  const decryptedString = decryptData(data.encriptedString)
  return NextResponse.json(
    {
      string: decryptedString,
    },
    { status: 200 }
  )
}
