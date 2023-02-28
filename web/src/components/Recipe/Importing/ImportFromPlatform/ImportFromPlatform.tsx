import ImportFromPlatformSelector from './ImportFromPlatformSelector'
import ImportFromPlatformUploader from './ImportFromPlatformUploader'

const ImportFromPlatform = () => {
  const [selectedPlatform, setSelectedPlatform] = React.useState<
    SupportedPlatforms | undefined
  >(undefined)

  if (selectedPlatform) {
    switch (selectedPlatform) {
      case 'crouton':
        return <ImportFromPlatformUploader />
    }
  } else {
    return (
      <ImportFromPlatformSelector setSelectedPlatform={setSelectedPlatform} />
    )
  }
}

export default ImportFromPlatform
