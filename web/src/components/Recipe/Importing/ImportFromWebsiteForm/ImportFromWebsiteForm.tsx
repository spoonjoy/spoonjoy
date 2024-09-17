import { ImportRecipeFromWebsiteMutation } from 'types/graphql'

import { Form } from '@redwoodjs/forms'
import { routes } from '@redwoodjs/router'
import { useMutation } from '@redwoodjs/web'
import { toast } from '@redwoodjs/web/toast'

import StyledTextField from 'src/components/formComponents/StyledTextField'

type FormImportRecipeFromWebsite = { url: string }

const IMPORT_RECIPE_FROM_WEBSITE_MUTATION = gql`
  mutation ImportRecipeFromWebsiteMutation($url: String!) {
    import: importRecipeFromWebsite(url: $url) {
      recipeId
    }
  }
`

interface IImportFromWebsiteFormProps {
  setShowLoading: (showLoading: boolean) => void
  setRedirectUrl: (redirectUrl: string) => void
  setOnRetry: React.Dispatch<React.SetStateAction<() => void>>
  setError: (error: Error | undefined) => void
}

const ImportFromWebsiteForm = ({
  setShowLoading,
  setRedirectUrl,
  setOnRetry,
  setError,
}: IImportFromWebsiteFormProps) => {
  const fieldRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    // i couldn't figure out why, but this wasn't working without the setTimeout
    setTimeout(() => {
      fieldRef.current?.focus()
    }, 100)
  }, [fieldRef])

  const [importRecipeFromWebsite, { error }] =
    useMutation<ImportRecipeFromWebsiteMutation>(
      IMPORT_RECIPE_FROM_WEBSITE_MUTATION,
      {
        onCompleted: (data) => {
          toast.success('recipe imported')
          setRedirectUrl(routes.recipe({ id: data.import.recipeId }))
        },
        onError: (error) => {
          toast.error(error.message)

          setOnRetry(() => () => {
            onSubmit({ url: fieldRef.current?.value || '' })
          })
        },
      }
    )

  setError(error)

  const onSubmit = ({ url }: FormImportRecipeFromWebsite) => {
    setShowLoading(true)
    importRecipeFromWebsite({ variables: { url } })
  }

  return (
    <Form<FormImportRecipeFromWebsite>
      className="m-auto max-w-sm pt-10"
      onSubmit={onSubmit}
    >
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
  )
}

export default ImportFromWebsiteForm
