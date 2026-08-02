export function docUrl(filename: string | null | undefined): string | undefined {
  return filename ? `${import.meta.env.BASE_URL}files/${filename}#view=FitV` : undefined
}

export function imgUrl(filename: string | null | undefined): string | undefined {
  return filename ? `${import.meta.env.BASE_URL}imgs/${filename}` : undefined
}

const bundledImgs = import.meta.glob<string>('@/assets/imgs/*', {
  eager: true,
  query: '?url',
  import: 'default',
})

export function assetUrl(filename: string): string | undefined {
  return bundledImgs[`/src/assets/imgs/${filename}`]
}
