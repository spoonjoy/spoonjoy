import ImportFromPlatformSelector from './ImportFromPlatformSelector'
import ImportFromPlatformUploader, {
  IImportFromPlatformUploaderProps,
} from './ImportFromPlatformUploader'

interface IImportFromPlatformProps {
  uploaderProps: IImportFromPlatformUploaderProps
}

const ImportFromPlatform = ({ uploaderProps }: IImportFromPlatformProps) => {
  const [selectedPlatform, setSelectedPlatform] = React.useState<
    SupportedPlatforms | undefined
  >(undefined)

  if (selectedPlatform) {
    switch (selectedPlatform) {
      case 'crouton':
        return <ImportFromPlatformUploader {...uploaderProps} />
    }
  } else {
    return (
      <ImportFromPlatformSelector setSelectedPlatform={setSelectedPlatform} />
    )
  }
}

export default ImportFromPlatform
