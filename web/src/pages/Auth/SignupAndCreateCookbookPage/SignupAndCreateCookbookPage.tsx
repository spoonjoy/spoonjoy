import { useEffect } from 'react'

import { navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import { useAuth } from 'src/auth'
import SignupForm from 'src/components/Auth/SignupForm'
import useAddRemoveCookbookMutations from 'src/components/Cookbook/useAddRemoveCookbookMutations'
import useNewCookbookMutation from 'src/components/Cookbook/useNewCookbookMutation'
import RecipeCell from 'src/components/Recipe/RecipeCell'
import { HeaderSlot, SimpleHeader } from 'src/layouts/SiteLayout/SiteLayout'

import AuthHeader from '../shared/AuthHeader'

interface ISignupAndCreateCookbookPageProps {
  recipeId: string
}

const SignupAndCreateCookbookPage = ({
  recipeId, // this is the recipeId that will be added to the new cookbook
}: ISignupAndCreateCookbookPageProps) => {
  const { currentUser } = useAuth()

  useEffect(() => {
    if (currentUser) {
      navigate(routes.user({ username: currentUser.username }))
    }
  }, [currentUser])

  const onAddToCookbookComplete = (cookbookId: string) => {
    navigate(routes.cookbook({ id: cookbookId }))
  }
  const { onAddToCookbook } = useAddRemoveCookbookMutations({
    onAddToCookbookComplete,
  })

  const onCreateCookbookComplete = (newCookbookId: string) => {
    onAddToCookbook(newCookbookId, recipeId)
  }

  const {
    onSave: createCookbook,
    loading,
    error,
  } = useNewCookbookMutation({ onCreateCookbookComplete })

  const onSignupComplete = () => {
    createCookbook({ title: 'My first cookbook!' })
  }

  return (
    <>
      <MetaTags title="signup and create cookbook" />
      <div className="absolute top-0 left-0 right-0 bottom-0 z-50">
        <div className="min-h-[250px] bg-gray-900 opacity-30 md:min-h-[350px]" />
        <div className="flex flex-col justify-center bg-white pb-20 md:pt-5">
          <AuthHeader location="new-cookbook" />
          <div className="mx-8 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <SignupForm onComplete={onSignupComplete} />
          </div>
        </div>
      </div>
      <HeaderSlot.Plug id="cookbooks">
        <SimpleHeader title={'My First Cookbook'} />
      </HeaderSlot.Plug>
      <RecipeCell shortRecipe id={recipeId} />
    </>
  )
}

export default SignupAndCreateCookbookPage
