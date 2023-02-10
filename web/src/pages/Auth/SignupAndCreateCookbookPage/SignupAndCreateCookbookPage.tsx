import { useEffect } from 'react'

import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import SignupForm from 'src/components/Auth/SignupForm'
import RecipeCell from 'src/components/Recipe/RecipeCell'
import { HeaderSlot, DefaultHeader } from 'src/layouts/SiteLayout/SiteLayout'

import AuthFormWrapper from '../shared/AuthFormWrapper'
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
      <HeaderSlot.Plug id="cookbooks">
        <DefaultHeader title={'My First Cookbook'} />
      </HeaderSlot.Plug>
      <RecipeCell shortRecipe id={recipeId} />
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <AuthHeader location="signup" />
        <AuthFormWrapper>
          <SignupForm />
        </AuthFormWrapper>
      </div>
    </>
  )
}

export default SignupAndCreateCookbookPage
