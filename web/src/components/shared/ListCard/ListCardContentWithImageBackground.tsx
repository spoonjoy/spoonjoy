interface IListCardContentWithImageBackgroundProps {
  imageUrl: string
  cardTitle: string
  byline?: string | null
  cardSubtitle?: string | null
  extraInfo?: React.ReactElement<HTMLDataListElement> | null
}

/**
 * This is designed to be wrapped in ListCardBase. It is a card with an image
 * background and a title and (optional) subtitle.
 * @param imageUrl The URL of the image to use as the background
 * @param cardTitle The title of the card
 * @param byline The optional author of the card - will be rendered as a byline underneath the card's title
 * @param cardSubtitle The optional subtitle of the card
 */
const ListCardContentWithImageBackground = ({
  imageUrl,
  cardTitle,
  byline,
  cardSubtitle,
  extraInfo,
}: IListCardContentWithImageBackgroundProps) => (
  <div
    className={`relative w-full overflow-hidden rounded-lg group-focus:ring-2 group-focus:ring-indigo-700`}
  >
    <div
      style={{
        backgroundImage: `url('${imageUrl}')`,
      }}
      className={`absolute top-0 bottom-0 left-0 right-0 bg-cover bg-bottom contrast-75 saturate-[.75] group-hover:contrast-100 group-hover:saturate-100 group-focus:contrast-100 group-focus:saturate-100`}
    />

    <div className="absolute bottom-0 flex w-full justify-center">
      <div className="mx-2 w-full">
        <div className="relative mb-2 rounded-md p-4 text-white backdrop-blur backdrop-brightness-50">
          <h3 className="text-xl font-medium text-white opacity-90">
            {cardTitle}
          </h3>
          <dl className="mt-1 flex flex-grow flex-col justify-between">
            {byline && (
              <dd className="mb-1 text-xs font-medium leading-none">
                <span className="opacity-70">by</span> {byline}
              </dd>
            )}
            <dd className="text-sm text-white opacity-80">{cardSubtitle}</dd>
            {extraInfo && extraInfo}
          </dl>
        </div>
      </div>
    </div>
  </div>
)

export default ListCardContentWithImageBackground
