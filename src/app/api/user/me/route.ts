import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, error: "Unauthorize"},
      { status: 401 }
    )
  }

  try {
    const { name } = await request.json()

    if (!name || typeof name !== 'string' || name.trim() === ''){
      return NextResponse.json(
        { success: false, error: "Name is Required"},
        { status: 401 }
      )
    }

    const updateUser = await prisma.user.update(
      {
        where: {id: session.user.id}, 
        data: { name: name }, 
        select: { id: true, name: true, email: true } 
      })

    return NextResponse.json({
      success: true,
      user: updateUser
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { success: false, error: "Failed to update user name" },
      { status: 500 },
    );
  }
}