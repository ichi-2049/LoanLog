import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }
  
    try {
      const currentUser = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true },
      });
  
      if (!currentUser) {
        return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
      }
  
      const friendships = await prisma.friendship.findMany({
        where: { uid: currentUser.id },
        include: {
          friend: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });
  
      const friends = friendships.map(friendship => friendship.friend);
      return NextResponse.json({ success: true, friends });
    } catch (error) {
      console.error("Error fetching friends:", error);
      return NextResponse.json({ success: false, error: "Failed to fetch friends" }, { status: 500 });
    }
  }
  