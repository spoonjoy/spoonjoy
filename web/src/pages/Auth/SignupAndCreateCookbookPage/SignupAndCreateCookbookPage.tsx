import { useEffect } from 'react'

import { useAuth } from '@redwoodjs/auth'
import { navigate, routes } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import SignupForm from 'src/components/Auth/SignupForm'
import withNewCookbookMutation, {
  IWithNewCookbookMutationChildProps,
} from 'src/components/Cookbook/withNewCookbookMutation/withNewCookbookMutation'
import RecipeCell from 'src/components/Recipe/RecipeCell'
import { HeaderSlot, DefaultHeader } from 'src/layouts/SiteLayout/SiteLayout'

import AuthHeader from '../shared/AuthHeader'

interface ISignupAndCreateCookbookPageProps {
  recipeId: string
}

const SignupAndCreateCookbookPageRenderer = ({
  recipeId, // this is the recipeId that will be added to the new cookbook
  onSave: createCookbook,
  loading: createCookbookLoading,
  error: createCookbookError,
}: ISignupAndCreateCookbookPageProps & IWithNewCookbookMutationChildProps) => {
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
        <div className="min-h-[250px] bg-gray-900 opacity-30 md:min-h-[350px]" />
        <div className="flex flex-col justify-center bg-white pb-20 md:pt-5">
          <AuthHeader location="new-cookbook" />
          <div className="mx-8 mt-8 sm:mx-auto sm:w-full sm:max-w-md">
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

const SignupAndCreateCookbookPageContainer = ({
  recipeId,
}: ISignupAndCreateCookbookPageProps) => {
  const ChildComponent =
    withNewCookbookMutation<ISignupAndCreateCookbookPageProps>({
      child: SignupAndCreateCookbookPageRenderer,
      outerProps: { recipeId },
    })

  return <ChildComponent />
}

export default SignupAndCreateCookbookPageContainer
