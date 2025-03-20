"use client"

import { useState } from "react"
import { useNameUpdate } from '../hooks/useNameUpdate';

export default function ProfileEditForm() {
  const { updateName, isLoading } = useNameUpdate()
  const [name, setName] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateName({ name })
      setSuccessMessage("名前を更新しました")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (error) {
      console.error("名前の更新に失敗しました:", error)
      setErrorMessage("名前の更新に失敗しました")
      setTimeout(() => setErrorMessage(""), 3000)
    }
  }

  return (
    <div className="max-w-sm mx-auto p-6 bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-white mb-6">プロフィール編集</h2>

      {
        successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
            {successMessage}
          </div>
        )
      }

      {
        errorMessage && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )
      }

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm text-white font-medium mb-1">
            名前
          </label>
          <input
           id="name"
           type="text"
           value={name}
           onChange={(e) => setName(e.target.value)}
           placeholder="新しい名前"
           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-gray-900"
           required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md font-medium text-white ${
            isLoading
              ? "bg-blue-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          }`}
        >
          {isLoading ? "更新中..." : "更新する"}
        </button>
      </form>
    </div>
  )
}
