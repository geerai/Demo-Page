# Preliminary evaluation: 10 REMI-sampling generations

This is an exploratory evaluation of 10 POP909-CL key+chord+melody conditioned
piano generations. It is not yet a population-level model evaluation.

## Alignment and validity

- 184 bars could be paired by a shared, complete, unique `BAR_xxx` id.
- Mean paired-bar coverage was 65.7% of the requested bars.
- 0/10 generation reports were grammar-valid.
- 8/10 generations stopped at the 2048-token context limit.
- Only 2/10 token sequences ended with a complete `<ROLE_END> <BAR_END>`.
- Across the 10 generations there were 26 duplicate bar occurrences, 54
  non-contiguous bar transitions, 8 truncated bar occurrences, and 5 malformed
  note positions.

For musical comparisons, the evaluator keeps only the first complete occurrence
of each emitted bar id and pairs it with the condition/reference bar with the
same id. Invalid and unpaired bars affect validity statistics but not harmony,
rhythm, or structure scores.

## Harmony

Macro-average (each sample has equal weight):

| Metric | Reference | Generated | Generated - reference |
|---|---:|---:|---:|
| Overall chord-tone ratio | 71.85% | 44.68% | -27.17 pp |
| First-beat chord-tone ratio | 76.07% | 44.12% | -31.95 pp |

Micro-average (each evaluable note onset has equal weight):

| Metric | Reference | Generated |
|---|---:|---:|
| Overall chord-tone ratio | 74.79% (1638/2190) | 44.17% (1285/2909) |
| First-beat chord-tone ratio | 73.86% (226/306) | 43.59% (187/429) |

`Overall CTR` counts a note as a hit when its onset pitch class belongs to the
active annotated chord. `First-beat CTR` applies the same test only at
`POSITION_000`. Chords are allowed to carry across a bar boundary until the
next chord event.

Important caveat: reference Sample 04 and Sample 09 have unusually low
first-beat CTR (11.8% and 13.6%). These should be listened to and inspected
against their chord annotations before CTR is accepted as a primary metric.
They may reveal annotation alignment or harmonic-label limitations rather than
bad reference music.

## Rhythm

| Metric | Reference | Generated |
|---|---:|---:|
| Mean notes per bar | 12.25 | 16.41 |
| Mean unique-onset IOI (48-grid units per quarter note) | 24.22 | 20.89 |
| Mean exact onset-position Jaccard | — | 0.509 |

The generated piano is denser and has shorter gaps between unique onset times.
Its duration distribution is also much shorter:

| Duration (grid units) | Reference count | Generated count |
|---|---:|---:|
| <=12 | 227 | 922 |
| 13–24 | 450 | 991 |
| 25–48 | 864 | 648 |
| 49–96 | 520 | 398 |
| >96 | 193 | 2 |

The near-absence of generated durations above 96 grid units is a strong,
audible difference that should be checked in listening tests.

## Structure

Each bar is represented by a normalized 12-bin pitch-class histogram, a 16-bin
onset histogram, and note density. Cosine similarity between every pair of bars
forms the self-similarity matrix (SSM).

| Metric | Reference | Generated |
|---|---:|---:|
| SSM repetition rate at similarity >= 0.8 | 49.17% | 61.46% |
| Mean reference/generated SSM correlation | \-0.033 | — |

The generated samples look more internally repetitive by this feature, while
their structural pattern has essentially no linear agreement with the paired
reference SSM. This does not mean a generated accompaniment must copy the
reference structure exactly; the result should be treated as a diagnostic, not
as a single quality score.

## Files

- `evaluation-summary.csv`: one row per generated sample.
- `dataset-summary.json`: aggregate metrics and methodology.
- `evaluation-details.json`: all sample- and bar-level results.
- `aggregate-duration-histogram.csv`: aggregate duration distribution.
- `aggregate-lag-similarity.csv`: reference/generated lag similarity.
- Each sample directory contains `evaluation.json`, `per-bar-harmony.csv`,
  `reference-ssm.csv`, and `generated-ssm.csv`.

