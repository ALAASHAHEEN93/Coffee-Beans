import type { GlobalConfig } from 'payload'

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Bestseller', value: 'bestseller' },
  { label: 'Single origin', value: 'single-origin' },
  { label: 'Espresso blend', value: 'espresso-blend' },
  { label: 'Rare varietal', value: 'rare-varietal' },
] as const

const statIconOptions = [
  { label: 'Box', value: 'box' },
  { label: 'Medal', value: 'medal' },
  { label: 'Star', value: 'star' },
  { label: 'Trend', value: 'trend' },
]

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Home',
  access: {
    read: () => true,
  },
  admin: {
    group: 'Pages',
    description:
      'Marketing home page (CoffeeLab). Default locale is German (de). Use the locale switcher in the admin bar to edit **de** vs **en** — fields look empty if the wrong locale is selected. Run `pnpm seed:home` to load defaults from the repo into the database.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Site & hero',
          fields: [
            {
              name: 'siteName',
              type: 'text',
              required: true,
              localized: true,
              admin: { description: 'Brand name shown in the header, footer, and logo alt fallback.' },
            },
            {
              name: 'siteLogo',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Wordmark or logo image. If empty, the header shows text from Site name only.',
              },
            },
            {
              name: 'skipLinkLabel',
              type: 'text',
              localized: true,
              admin: { description: 'Accessibility: “Skip to main content” link text.' },
            },
            {
              name: 'navItems',
              type: 'array',
              labels: { singular: 'Nav link', plural: 'Navigation' },
              admin: { description: 'Top navigation links (label + in-page anchor href).' },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  localized: true,
                  required: true,
                },
                {
                  name: 'href',
                  type: 'text',
                  required: true,
                  admin: { description: 'e.g. #variable-lab' },
                },
              ],
            },
            {
              name: 'accountAriaLabel',
              type: 'text',
              localized: true,
              admin: { description: 'Aria-label for the account icon button.' },
            },
            {
              name: 'cartAriaLabel',
              type: 'text',
              localized: true,
              admin: { description: 'Aria-label for the cart icon button.' },
            },
            {
              name: 'heroBackground',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Full-width hero background. If empty, a neutral gradient placeholder is used (no static asset path).',
              },
            },
            {
              name: 'heroKicker',
              type: 'text',
              localized: true,
              admin: { description: 'Small line above the headline (e.g. lab status).' },
            },
            {
              name: 'heroTitleLine1',
              type: 'text',
              localized: true,
              admin: { description: 'Main headline — first line.' },
            },
            {
              name: 'heroTitleLine2',
              type: 'text',
              localized: true,
              admin: { description: 'Main headline — second line (often styled differently in CSS).' },
            },
            {
              name: 'heroSubtitle',
              type: 'textarea',
              localized: true,
              admin: { description: 'Supporting paragraph under the headline.' },
            },
            {
              name: 'heroAccentWord1',
              type: 'text',
              localized: true,
              admin: { description: 'First highlighted word in the subtitle (styled as accent).' },
            },
            {
              name: 'heroAccentWord2',
              type: 'text',
              localized: true,
              admin: { description: 'Second highlighted word in the subtitle.' },
            },
            {
              name: 'heroPrimaryCtaLabel',
              type: 'text',
              localized: true,
            },
            {
              name: 'heroPrimaryCtaHref',
              type: 'text',
              admin: { description: 'Anchor or URL for primary CTA.' },
            },
            {
              name: 'heroSecondaryCtaLabel',
              type: 'text',
              localized: true,
            },
            {
              name: 'heroSecondaryCtaHref',
              type: 'text',
            },
          ],
        },
        {
          label: 'Laboratory store',
          fields: [
            {
              name: 'laboratoryPhase',
              type: 'text',
              localized: true,
              admin: { description: 'Eyebrow above the section title.' },
            },
            {
              name: 'laboratoryTitle',
              type: 'text',
              localized: true,
            },
            {
              name: 'laboratoryIntro',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'laboratoryEmptyFilter',
              type: 'text',
              localized: true,
              admin: { description: 'Message when no products match the filter.' },
            },
            {
              name: 'laboratoryPriceLabel',
              type: 'text',
              localized: true,
              admin: { description: 'Small label above price (e.g. PRICE / 12OZ).' },
            },
            {
              name: 'laboratoryAddToCartAriaTemplate',
              type: 'text',
              localized: true,
              admin: {
                description: 'Use {title} where the product title should appear in the aria-label.',
              },
            },
            {
              name: 'storeFilters',
              type: 'array',
              labels: { singular: 'Filter', plural: 'Category filters' },
              admin: { description: 'Filter tabs; id must match product category values.' },
              fields: [
                {
                  name: 'id',
                  type: 'select',
                  required: true,
                  options: [...filterOptions],
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  localized: true,
                },
              ],
            },
            {
              name: 'storeProducts',
              type: 'array',
              labels: { singular: 'Product', plural: 'Products' },
              fields: [
                {
                  name: 'key',
                  type: 'text',
                  required: true,
                  admin: { description: 'Stable id for React keys (e.g. 1, 2, …).' },
                },
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  localized: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  localized: true,
                },
                {
                  name: 'tags',
                  type: 'array',
                  labels: { singular: 'Tag', plural: 'Tags' },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      localized: true,
                    },
                  ],
                },
                {
                  name: 'rating',
                  type: 'number',
                  required: true,
                  min: 0,
                  max: 5,
                },
                {
                  name: 'reviews',
                  type: 'number',
                  required: true,
                  min: 0,
                },
                {
                  name: 'price',
                  type: 'text',
                  required: true,
                  localized: true,
                  admin: { description: 'Display price e.g. €24,00 or $24.00' },
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'categories',
                  type: 'select',
                  hasMany: true,
                  required: true,
                  options: filterOptions.filter((o) => o.value !== 'all'),
                  admin: { description: 'Which filters this product appears under.' },
                },
              ],
            },
            {
              name: 'labStats',
              type: 'array',
              labels: { singular: 'Stat', plural: 'Laboratory stats' },
              maxRows: 4,
              fields: [
                {
                  name: 'value',
                  type: 'text',
                  required: true,
                  localized: true,
                },
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  localized: true,
                },
                {
                  name: 'icon',
                  type: 'select',
                  required: true,
                  options: [...statIconOptions],
                },
              ],
            },
          ],
        },
        {
          label: 'Protocol & stories',
          fields: [
            {
              name: 'protocolEyebrow',
              type: 'text',
              localized: true,
            },
            {
              name: 'protocolTitle',
              type: 'text',
              localized: true,
            },
            {
              name: 'brewEspressoLabel',
              type: 'text',
              localized: true,
            },
            {
              name: 'brewFilterLabel',
              type: 'text',
              localized: true,
            },
            {
              name: 'geneticSection',
              type: 'group',
              label: 'Story: Genetic sourcing',
              fields: [
                {
                  name: 'mediaTag',
                  type: 'text',
                  localized: true,
                  admin: { description: 'Badge text on the image.' },
                },
                {
                  name: 'phase',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'body',
                  type: 'textarea',
                  localized: true,
                },
                {
                  name: 'ctaLabel',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'ctaHref',
                  type: 'text',
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
            {
              name: 'thermalSection',
              type: 'group',
              label: 'Story: Thermal precision',
              fields: [
                {
                  name: 'mediaTag',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'phase',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'body',
                  type: 'textarea',
                  localized: true,
                },
                {
                  name: 'ctaLabel',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'ctaHref',
                  type: 'text',
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
            {
              name: 'valueSection',
              type: 'group',
              label: 'Story: Transparency',
              fields: [
                {
                  name: 'mediaTag',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'phase',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'body',
                  type: 'textarea',
                  localized: true,
                },
                {
                  name: 'ctaLabel',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'ctaHref',
                  type: 'text',
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
              ],
            },
          ],
        },
        {
          label: 'Precision lab',
          fields: [
            {
              name: 'precisionPhase',
              type: 'text',
              localized: true,
            },
            {
              name: 'precisionTitle',
              type: 'text',
              localized: true,
            },
            {
              name: 'precisionIntro',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'precisionPanelTitle',
              type: 'text',
              localized: true,
            },
            {
              name: 'precisionStatusPrefix',
              type: 'text',
              localized: true,
              admin: { description: 'Text before brew mode in status (e.g. STATUS: ACTIVE //).' },
            },
            {
              name: 'axisRoast',
              type: 'text',
              localized: true,
            },
            {
              name: 'axisAcidity',
              type: 'text',
              localized: true,
            },
            {
              name: 'axisBody',
              type: 'text',
              localized: true,
            },
            {
              name: 'axisSweetness',
              type: 'text',
              localized: true,
            },
            {
              name: 'axisComplexity',
              type: 'text',
              localized: true,
            },
            {
              name: 'matrixHeading',
              type: 'text',
              localized: true,
            },
            {
              name: 'matrixTagsEspresso',
              type: 'array',
              labels: { singular: 'Tag', plural: 'Matrix tags (espresso)' },
              fields: [{ name: 'text', type: 'text', required: true, localized: true }],
            },
            {
              name: 'matrixTagsFilter',
              type: 'array',
              labels: { singular: 'Tag', plural: 'Matrix tags (filter)' },
              fields: [{ name: 'text', type: 'text', required: true, localized: true }],
            },
            {
              name: 'synthesizeButton',
              type: 'text',
              localized: true,
            },
            {
              name: 'scanStats',
              type: 'array',
              labels: { singular: 'Line', plural: 'Scan stats (right column)' },
              maxRows: 3,
              fields: [
                {
                  name: 'template',
                  type: 'text',
                  required: true,
                  localized: true,
                  admin: {
                    description:
                      'Use {beam} and {water} for dynamic values (espresso vs filter). Line 1 can stay static (e.g. SCAN_UID: X-992).',
                  },
                },
              ],
            },
            {
              name: 'roastSliderLabel',
              type: 'text',
              localized: true,
            },
            {
              name: 'radarAriaLabel',
              type: 'text',
              localized: true,
            },
            {
              name: 'flavorNote',
              type: 'text',
              localized: true,
            },
          ],
        },
        {
          label: 'Blending & vault',
          fields: [
            {
              name: 'blendingPhase',
              type: 'text',
              localized: true,
            },
            {
              name: 'blendingTitle',
              type: 'text',
              localized: true,
            },
            {
              name: 'blendingIntro',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'blendingTabExpert',
              type: 'text',
              localized: true,
            },
            {
              name: 'blendingTabManual',
              type: 'text',
              localized: true,
            },
            {
              name: 'blendingExpertCards',
              type: 'array',
              labels: { singular: 'Expert card', plural: 'Expert curation cards' },
              maxRows: 2,
              fields: [
                {
                  name: 'intensityLabel',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'sensoryFilter',
                  type: 'textarea',
                  localized: true,
                },
                {
                  name: 'sensoryEspresso',
                  type: 'textarea',
                  localized: true,
                },
                {
                  name: 'geneticBase',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'methodologyFilter',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'methodologyEspresso',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'price',
                  type: 'text',
                  localized: true,
                },
                {
                  name: 'cta',
                  type: 'text',
                  localized: true,
                },
              ],
            },
            {
              name: 'manualAssemblerTitle',
              type: 'text',
              localized: true,
            },
            {
              name: 'manualAssemblerProtocolPrefix',
              type: 'text',
              localized: true,
              admin: { description: 'Shown before brew mode, e.g. PROTOCOL: MANUAL_OVERRIDE //' },
            },
            {
              name: 'manualRecalibrate',
              type: 'text',
              localized: true,
            },
            {
              name: 'manualRowsEspresso',
              type: 'array',
              labels: { singular: 'Row', plural: 'Manual rows (espresso)' },
              maxRows: 3,
              fields: [
                { name: 'code', type: 'text', localized: true },
                { name: 'name', type: 'text', localized: true },
              ],
            },
            {
              name: 'manualRowsFilter',
              type: 'array',
              labels: { singular: 'Row', plural: 'Manual rows (filter)' },
              maxRows: 3,
              fields: [
                { name: 'code', type: 'text', localized: true },
                { name: 'name', type: 'text', localized: true },
              ],
            },
            {
              name: 'saturationLabel',
              type: 'text',
              localized: true,
            },
            {
              name: 'stabilityLabel',
              type: 'text',
              localized: true,
            },
            {
              name: 'stabilityLocked',
              type: 'text',
              localized: true,
            },
            {
              name: 'stabilityCalibrating',
              type: 'text',
              localized: true,
            },
            {
              name: 'finalizeAssembly',
              type: 'text',
              localized: true,
            },
            {
              name: 'vaultPhase',
              type: 'text',
              localized: true,
            },
            {
              name: 'vaultTitle',
              type: 'text',
              localized: true,
            },
            {
              name: 'vaultIntro',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'vaultCuppingLabel',
              type: 'text',
              localized: true,
            },
            {
              name: 'vaultSpecimenYear',
              type: 'text',
              localized: true,
              admin: { description: 'e.g. SPECIMEN // 2026' },
            },
            {
              name: 'vaultMetadataLabel',
              type: 'text',
              localized: true,
            },
            {
              name: 'vaultMetadataValue',
              type: 'text',
              localized: true,
            },
            {
              name: 'vaultCards',
              type: 'array',
              labels: { singular: 'Card', plural: 'Vault cards' },
              fields: [
                { name: 'score', type: 'text', localized: true },
                { name: 'title', type: 'text', localized: true },
                { name: 'label', type: 'text', localized: true },
                { name: 'description', type: 'textarea', localized: true },
                { name: 'priceButton', type: 'text', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Footer',
          fields: [
            {
              name: 'footerTagline',
              type: 'text',
              localized: true,
              admin: { description: 'Line under logo (e.g. MOLECULAR ROASTERY // STATION).' },
            },
            {
              name: 'footerMission',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'footerMapTitle',
              type: 'text',
              localized: true,
            },
            {
              name: 'footerMapLinks',
              type: 'array',
              labels: { singular: 'Link', plural: 'System map links' },
              fields: [
                { name: 'label', type: 'text', required: true, localized: true },
                { name: 'href', type: 'text', required: true },
              ],
            },
            {
              name: 'footerOpsTitle',
              type: 'text',
              localized: true,
            },
            {
              name: 'footerOpsLinks',
              type: 'array',
              labels: { singular: 'Link', plural: 'Operations links' },
              fields: [
                { name: 'label', type: 'text', required: true, localized: true },
                { name: 'href', type: 'text', required: true },
              ],
            },
            {
              name: 'footerFeedTitle',
              type: 'text',
              localized: true,
            },
            {
              name: 'footerFeedDescription',
              type: 'textarea',
              localized: true,
            },
            {
              name: 'footerFeedPlaceholder',
              type: 'text',
              localized: true,
            },
            {
              name: 'footerFeedSubmit',
              type: 'text',
              localized: true,
            },
            {
              name: 'footerFeedEncryption',
              type: 'text',
              localized: true,
            },
            {
              name: 'footerFeedSuccess',
              type: 'text',
              localized: true,
            },
            {
              name: 'footerCopyright',
              type: 'text',
              localized: true,
              admin: { description: '© line; use {year} for the current year.' },
            },
            {
              name: 'neuralFeedMailSubject',
              type: 'text',
              localized: true,
              admin: { description: 'mailto subject for the newsletter signup form.' },
            },
            {
              name: 'neuralFeedMailBodyIntro',
              type: 'text',
              localized: true,
              admin: { description: 'First lines of the mailto body before the user email line.' },
            },
          ],
        },
      ],
    },
  ],
}
