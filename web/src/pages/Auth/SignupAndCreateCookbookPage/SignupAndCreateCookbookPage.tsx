import { useEffect } from 'react'

import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import SignupForm from 'src/components/Auth/SignupForm'
import RecipeCell from 'src/components/Recipe/RecipeCell'
import { HeaderSlot, DefaultHeader } from 'src/layouts/SiteLayout/SiteLayout'

import AuthHeader from '../shared/AuthHeader'

interface ISignupAndCreateCookbookPageProps {
  recipeId: string
}

const SignupAndCreateCookbookPage = ({
  recipeId,
}: ISignupAndCreateCookbookPageProps) => {
  const { currentUser } = useAuth()

  useEffect(() => {
    if (currentUser) {
      navigate(routes.user({ username: currentUser.username }))
    }
  }, [currentUser])

  return (
    <>
      <MetaTags title="signup and create cookbook" />
      <div className="absolute top-0 left-0 right-0 bottom-0 z-50">
        <div className="min-h-[250px] bg-gray-900 opacity-30" />
        <div className="flex flex-col justify-center bg-white pb-20 sm:px-6 lg:px-8 ">
          <AuthHeader location="new-cookbook" />
          <div className="px-10 pt-5">
            <SignupForm />
          </div>
        </div>
      </div>
      <HeaderSlot.Plug id="cookbooks">
        <DefaultHeader title={'My First Cookbook'} />
      </HeaderSlot.Plug>
      <RecipeCell shortRecipe id={recipeId} />
    </>
  )
}

export default SignupAndCreateCookbookPage
