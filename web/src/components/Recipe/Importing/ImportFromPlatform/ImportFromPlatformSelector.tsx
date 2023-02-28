interface IImportFromPlatformSelectorProps {
  setSelectedPlatform: (platform: SupportedPlatforms) => void
}

const ImportFromPlatformSelector = ({
  setSelectedPlatform,
}: IImportFromPlatformSelectorProps) => {
  return (
    <div>
      <ul>
        <li>
          <button onClick={() => setSelectedPlatform('crouton')}>
            Crouton
          </button>
        </li>
      </ul>
    </div>
  )
}

export default ImportFromPlatformSelector
