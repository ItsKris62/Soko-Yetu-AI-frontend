'use client'

import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'

const DEFAULT_MALE =
  'https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1739773924/users/kpbgeoowhpeutmmveldv.png'
const DEFAULT_FEMALE =
  'https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1739773923/users/o5i1nqiweilsvy8cznfm.png'
const DEFAULT_BANNER =
  'https://res.cloudinary.com/veriwoks-sokoyetu/image/upload/v1741199723/Home-images/zin82kcmo6r7bgiuebgm.jpg'

export default function ProfileBanner() {
  const { user } = useAuth()
  const profilePic = user?.profile_picture || (user?.gender === 'female' ? DEFAULT_FEMALE : DEFAULT_MALE)

  return (
    <div className="relative w-full h-64 bg-cover bg-center" style={{ backgroundImage: `url(${DEFAULT_BANNER})` }}>
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="absolute bottom-0 left-10 transform translate-y-1/2 flex items-end gap-4">
        <Image
          src={profilePic}
          alt="Profile"
          width={96}
          height={96}
          className="rounded-full border-4 border-white shadow-md object-cover"
        />
        <div className="text-white">
          <h2 className="text-2xl font-bold">{user?.first_name} {user?.last_name}</h2>
          <p className="text-sm opacity-90">{user?.role} • {user?.county_name}</p>
        </div>
      </div>
      <div className="absolute top-4 right-10 flex gap-4">
        <button className="bg-green-600 text-white px-4 py-2 rounded shadow hover:bg-green-700">
          <i className="fas fa-edit mr-1" /> Edit Profile
        </button>
        <button className="bg-white text-dark px-4 py-2 rounded shadow border hover:bg-neutral-100">
          <i className="fas fa-share-alt mr-1" /> Share
        </button>
      </div>
    </div>
  )
}
