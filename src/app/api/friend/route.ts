import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// 友達検索API
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { searchParams } = new URL(request.url);
  const searchId = searchParams.get("id");

  if (!searchId) {
    return NextResponse.json(
      { success: false, error: "Search ID is required" },
      { status: 400 },
    );
  }

  try {
    // 現在のユーザーを取得
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // 検索対象のユーザーが自分自身でないことを確認
    if (searchId === currentUser.id) {
      return NextResponse.json(
        { success: false, error: "自分自身は追加できません" },
        { status: 400 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: searchId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to search user" },
      { status: 500 },
    );
  }
}

// 友達追加API
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const { friendId } = await request.json();
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // 双方向のフレンドシップを作成
    await prisma.$transaction([
      prisma.friendship.create({
        data: {
          uid: currentUser.id,
          friend_uid: friendId,
        },
      }),
      prisma.friendship.create({
        data: {
          uid: friendId,
          friend_uid: currentUser.id,
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Failed to add friend" },
      { status: 500 },
    );
  }
}
