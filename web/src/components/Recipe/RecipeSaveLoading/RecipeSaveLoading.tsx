import Loading from 'src/components/Loading/Loading'

const RecipeSaveLoading = () => {
  const subText = [
    'taking a photo',
    'whipping up some magic',
    'baking to perfection',
    'seasoning to taste',
    'heating things up',
    'stirring the pot',
    'bringing it all together',
    'almost ready to serve',
    'plating it',
  ]

  return <Loading subText={subText} />
}

export default RecipeSaveLoading
