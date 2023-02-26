import { Form } from '@redwoodjs/forms'
import { Link } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import StyledTextField from 'src/components/formComponents/StyledTextField'
import RecipeImportLoading from 'src/components/Recipe/Importing/RecipeImportLoading/RecipeImportLoading'
import { HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

const ImportRecipesPage = () => {
  const fieldRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    // i couldn't figure out why, but this wasn't working without the setTimeout
    setTimeout(() => {
      fieldRef.current?.focus()
    }, 100)
  }, [fieldRef])

  return (
    <>
      <RecipeImportLoading />
      <MetaTags title="import recipes" description="Import Recipes page" />
      <HeaderSlot.Plug id="recipe">
        <div className="mt-20 w-screen text-center xl:mt-40">
          <span className="text-xl text-indigo-700 sm:text-2xl">import to</span>
          <br />
          <span className="text-5xl sm:text-6xl">spoonjoy</span>
        </div>
      </HeaderSlot.Plug>
      <Form className="m-auto max-w-sm pt-10">
        <StyledTextField
          fieldName="url"
          placeholder="paste link to recipe"
          validation={{ required: true }}
          ref={fieldRef}
          grow
        />
        <button className="btn-submit-primary w-full" type="submit">
          import from website
        </button>
      </Form>
      <div className="mt-2 text-center text-sm">
        or{' '}
        <Link to="#" className="link">
          import from another platform
        </Link>
      </div>
    </>
  )
}

export default ImportRecipesPage
