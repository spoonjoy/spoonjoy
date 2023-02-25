import { Form } from '@redwoodjs/forms'
import { Link } from '@redwoodjs/router'
import { MetaTags } from '@redwoodjs/web'

import StyledTextField from 'src/components/formComponents/StyledTextField'
import { HeaderSlot } from 'src/layouts/SiteLayout/SiteLayout'

const ImportRecipesPage = () => {
  return (
    <>
      <MetaTags title="import recipes" description="Import Recipes page" />
      <HeaderSlot.Plug id="recipe">
        <div className="mt-20 w-screen text-center">
          <span className="text-xl text-indigo-700">import to</span>
          <br />
          <span className="text-5xl">spoonjoy</span>
        </div>
      </HeaderSlot.Plug>
      <Form className="m-auto max-w-sm pt-10">
        <StyledTextField
          fieldName="url"
          placeholder="paste link to recipe"
          validation={{ required: true }}
        />
        <button className="btn-submit-primary w-full" type="submit">
          import recipe
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
