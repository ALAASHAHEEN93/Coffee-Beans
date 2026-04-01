import type { Home } from '@/payload-types'
import { HOME_DEFAULTS } from './homeDefaults'

const SHOP_HREF = '#roastery'

function mergeNavItems(
  cms: Home['navItems'] | null | undefined,
  defaults: NonNullable<Home['navItems']>,
): NonNullable<Home['navItems']> {
  if (!cms?.length) return defaults
  const list = [...cms]
  const shopIdx = list.findIndex(
    (i) => i.href === SHOP_HREF || String(i.label ?? '').toUpperCase() === 'SHOP',
  )
  if (shopIdx === 0) return list
  if (shopIdx > 0) {
    const [row] = list.splice(shopIdx, 1)
    return [row, ...list]
  }
  const defaultShop = defaults[0]
  if (defaultShop?.href === SHOP_HREF) return [defaultShop, ...list]
  return list
}

/**
 * Shallow-deep merge of CMS home global with English defaults so every field resolves.
 */
export function mergeHome(h: Home | null): Home {
  const d = HOME_DEFAULTS
  const x = h ?? ({} as Home)

  return {
    id: x.id ?? 'home',
    siteName: x.siteName ?? d.siteName!,
    siteLogo: x.siteLogo ?? d.siteLogo,
    skipLinkLabel: x.skipLinkLabel ?? d.skipLinkLabel,
    navItems: mergeNavItems(x.navItems, d.navItems!),
    accountAriaLabel: x.accountAriaLabel ?? d.accountAriaLabel,
    cartAriaLabel: x.cartAriaLabel ?? d.cartAriaLabel,
    heroBackground: x.heroBackground ?? d.heroBackground,
    heroKicker: x.heroKicker ?? d.heroKicker,
    heroTitleLine1: x.heroTitleLine1 ?? d.heroTitleLine1,
    heroTitleLine2: x.heroTitleLine2 ?? d.heroTitleLine2,
    heroSubtitle: x.heroSubtitle ?? d.heroSubtitle,
    heroAccentWord1: x.heroAccentWord1 ?? d.heroAccentWord1,
    heroAccentWord2: x.heroAccentWord2 ?? d.heroAccentWord2,
    heroPrimaryCtaLabel: x.heroPrimaryCtaLabel ?? d.heroPrimaryCtaLabel,
    heroPrimaryCtaHref: x.heroPrimaryCtaHref ?? d.heroPrimaryCtaHref,
    heroSecondaryCtaLabel: x.heroSecondaryCtaLabel ?? d.heroSecondaryCtaLabel,
    heroSecondaryCtaHref: x.heroSecondaryCtaHref ?? d.heroSecondaryCtaHref,
    laboratoryPhase: x.laboratoryPhase ?? d.laboratoryPhase,
    laboratoryTitle: x.laboratoryTitle ?? d.laboratoryTitle,
    laboratoryIntro: x.laboratoryIntro ?? d.laboratoryIntro,
    laboratoryEmptyFilter: x.laboratoryEmptyFilter ?? d.laboratoryEmptyFilter,
    laboratoryPriceLabel: x.laboratoryPriceLabel ?? d.laboratoryPriceLabel,
    laboratoryAddToCartAriaTemplate: x.laboratoryAddToCartAriaTemplate ?? d.laboratoryAddToCartAriaTemplate,
    storeFilters: x.storeFilters?.length ? x.storeFilters : d.storeFilters,
    storeProducts: x.storeProducts?.length ? x.storeProducts : d.storeProducts,
    labStats: x.labStats?.length ? x.labStats : d.labStats,
    protocolEyebrow: x.protocolEyebrow ?? d.protocolEyebrow,
    protocolTitle: x.protocolTitle ?? d.protocolTitle,
    brewEspressoLabel: x.brewEspressoLabel ?? d.brewEspressoLabel,
    brewFilterLabel: x.brewFilterLabel ?? d.brewFilterLabel,
    geneticSection: { ...d.geneticSection, ...x.geneticSection },
    thermalSection: { ...d.thermalSection, ...x.thermalSection },
    valueSection: { ...d.valueSection, ...x.valueSection },
    precisionPhase: x.precisionPhase ?? d.precisionPhase,
    precisionTitle: x.precisionTitle ?? d.precisionTitle,
    precisionIntro: x.precisionIntro ?? d.precisionIntro,
    precisionPanelTitle: x.precisionPanelTitle ?? d.precisionPanelTitle,
    precisionStatusPrefix: x.precisionStatusPrefix ?? d.precisionStatusPrefix,
    axisRoast: x.axisRoast ?? d.axisRoast,
    axisAcidity: x.axisAcidity ?? d.axisAcidity,
    axisBody: x.axisBody ?? d.axisBody,
    axisSweetness: x.axisSweetness ?? d.axisSweetness,
    axisComplexity: x.axisComplexity ?? d.axisComplexity,
    matrixHeading: x.matrixHeading ?? d.matrixHeading,
    matrixTagsEspresso: x.matrixTagsEspresso?.length ? x.matrixTagsEspresso : d.matrixTagsEspresso,
    matrixTagsFilter: x.matrixTagsFilter?.length ? x.matrixTagsFilter : d.matrixTagsFilter,
    synthesizeButton: x.synthesizeButton ?? d.synthesizeButton,
    scanStats: x.scanStats?.length ? x.scanStats : d.scanStats,
    roastSliderLabel: x.roastSliderLabel ?? d.roastSliderLabel,
    radarAriaLabel: x.radarAriaLabel ?? d.radarAriaLabel,
    flavorNote: x.flavorNote ?? d.flavorNote,
    blendingPhase: x.blendingPhase ?? d.blendingPhase,
    blendingTitle: x.blendingTitle ?? d.blendingTitle,
    blendingIntro: x.blendingIntro ?? d.blendingIntro,
    blendingTabExpert: x.blendingTabExpert ?? d.blendingTabExpert,
    blendingTabManual: x.blendingTabManual ?? d.blendingTabManual,
    blendingExpertCards: x.blendingExpertCards?.length ? x.blendingExpertCards : d.blendingExpertCards,
    manualAssemblerTitle: x.manualAssemblerTitle ?? d.manualAssemblerTitle,
    manualAssemblerProtocolPrefix: x.manualAssemblerProtocolPrefix ?? d.manualAssemblerProtocolPrefix,
    manualRecalibrate: x.manualRecalibrate ?? d.manualRecalibrate,
    manualRowsEspresso: x.manualRowsEspresso?.length ? x.manualRowsEspresso : d.manualRowsEspresso,
    manualRowsFilter: x.manualRowsFilter?.length ? x.manualRowsFilter : d.manualRowsFilter,
    saturationLabel: x.saturationLabel ?? d.saturationLabel,
    stabilityLabel: x.stabilityLabel ?? d.stabilityLabel,
    stabilityLocked: x.stabilityLocked ?? d.stabilityLocked,
    stabilityCalibrating: x.stabilityCalibrating ?? d.stabilityCalibrating,
    finalizeAssembly: x.finalizeAssembly ?? d.finalizeAssembly,
    vaultPhase: x.vaultPhase ?? d.vaultPhase,
    vaultTitle: x.vaultTitle ?? d.vaultTitle,
    vaultIntro: x.vaultIntro ?? d.vaultIntro,
    vaultCuppingLabel: x.vaultCuppingLabel ?? d.vaultCuppingLabel,
    vaultSpecimenYear: x.vaultSpecimenYear ?? d.vaultSpecimenYear,
    vaultMetadataLabel: x.vaultMetadataLabel ?? d.vaultMetadataLabel,
    vaultMetadataValue: x.vaultMetadataValue ?? d.vaultMetadataValue,
    vaultCards: x.vaultCards?.length ? x.vaultCards : d.vaultCards,
    footerTagline: x.footerTagline ?? d.footerTagline,
    footerMission: x.footerMission ?? d.footerMission,
    footerMapTitle: x.footerMapTitle ?? d.footerMapTitle,
    footerMapLinks: x.footerMapLinks?.length ? x.footerMapLinks : d.footerMapLinks,
    footerOpsTitle: x.footerOpsTitle ?? d.footerOpsTitle,
    footerOpsLinks: x.footerOpsLinks?.length ? x.footerOpsLinks : d.footerOpsLinks,
    footerFeedTitle: x.footerFeedTitle ?? d.footerFeedTitle,
    footerFeedDescription: x.footerFeedDescription ?? d.footerFeedDescription,
    footerFeedPlaceholder: x.footerFeedPlaceholder ?? d.footerFeedPlaceholder,
    footerFeedSubmit: x.footerFeedSubmit ?? d.footerFeedSubmit,
    footerFeedEncryption: x.footerFeedEncryption ?? d.footerFeedEncryption,
    footerFeedSuccess: x.footerFeedSuccess ?? d.footerFeedSuccess,
    footerCopyright: x.footerCopyright ?? d.footerCopyright,
    neuralFeedMailSubject: x.neuralFeedMailSubject ?? d.neuralFeedMailSubject,
    neuralFeedMailBodyIntro: x.neuralFeedMailBodyIntro ?? d.neuralFeedMailBodyIntro,
    updatedAt: x.updatedAt,
    createdAt: x.createdAt,
  }
}
