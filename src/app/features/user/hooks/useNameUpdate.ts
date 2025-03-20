import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

type NameUpdateData = {
  name: string
}

export const useNameUpdate = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)

  const updateName = async (data: NameUpdateData) => {
    try {
      if (!session) {
        router.push("/login")
        return
      }

      setIsLoading(true)
      const response = await fetch("/api/user/me", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include"
      })

      if (response.status === 401) {
        router.push("/login")
        return
      }

      if (!response.ok) {
        throw new Error("名前の更新に失敗しました")
      }

      router.refresh()
      return await response.json()
    } catch (error) {
      console.error(error)
      alert("名前の更新に失敗しました")
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { updateName, isLoading }
}