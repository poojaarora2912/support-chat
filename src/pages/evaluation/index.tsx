import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import _ from 'lodash';

import { RootState } from '../../redux/store';
import { fetchEvaluation } from '../../redux/actions/evalutation';
import type { Evaluation as EvaluationType } from '../../redux/reducers/evaluationReducer';

import styles from './style.module.scss';

const SCORE_LABELS: Record<keyof EvaluationType['scores'], string> = {
  chat_acknowledgment_initial_response: 'Chat acknowledgment & initial response',
  issue_understanding_diagnosis: 'Issue understanding & diagnosis',
  resolution_provided: 'Resolution provided',
  communication_tone: 'Communication tone',
  documentation_ticket_management: 'Documentation & ticket management',
};

function getEvaluationIdFromUrl(url: string): string | null {
  if (!url) return null;
  const match = url.match(/conversation\/(\d+)/);
  return match ? match[1] : null;
}

export default function Evaluation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const activatedTab = useSelector(
    (state: RootState) => state.selection?.activatedTab ?? null
  );

  const evaluationId = useMemo(() => {
    const fromUrl = activatedTab?.url
      ? getEvaluationIdFromUrl(activatedTab.url)
      : null;
    return fromUrl ?? (activatedTab ? String(activatedTab.tabId) : null);
  }, [activatedTab]);

  const evaluation = useSelector((state: RootState) =>
    evaluationId ? _.get(state, `evaluation.items.${evaluationId}`) : null
  );

  const loading = useSelector(
    (state: RootState) => state.evaluation?.loading ?? false
  );

  const error = useSelector(
    (state: RootState) => state.evaluation?.error ?? null
  );

  const prevEvaluationIdRef = useRef<string | null>(null);

  const [stage, setStage] = useState<'fetching' | 'evaluating'>('fetching');

  useEffect(() => {
    const prevId = prevEvaluationIdRef.current;

    if (prevId !== null && evaluationId !== prevId) {
      prevEvaluationIdRef.current = evaluationId;
      navigate('/');
      return;
    }

    prevEvaluationIdRef.current = evaluationId;

    if (evaluationId) {
      dispatch(fetchEvaluation(evaluationId));
    }
  }, [dispatch, evaluationId, navigate]);

  useEffect(() => {
    if (!loading) return;

    setStage('fetching');

    const timer = setTimeout(() => {
      setStage('evaluating');
    }, 1500);

    return () => clearTimeout(timer);
  }, [loading, evaluationId]);

  const emptyText = 'Not provided';

  if (loading) {
    return (
      <div className={`${styles.container} ${styles.containerFullScreen}`}>
        <div className={styles.inner}>
          <div className={styles.loaderWrap}>
            <div className={styles.loader}>
              <span className={styles.dot} />
              <p key={stage} className={styles.loaderText}>
                {stage === 'fetching'
                  ? 'Getting your chats'
                  : 'Evaluating your chats'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !evaluation) {
    return (
      <div className={styles.container}>
        <div className={styles.messageWrap}>
          <p className={styles.error}>
            {typeof error === 'string'
              ? error
              : 'Evaluation failed to load'}
          </p>
        </div>
      </div>
    );
  }

  if (!evaluationId) {
    return (
      <div className={styles.container}>
        <div className={styles.messageWrap}>
          <p className={styles.emptyState}>
            Open a support conversation and use “Evaluate your chat” to see an
            evaluation here.
          </p>
        </div>
      </div>
    );
  }

  if (!evaluation) {
    return (
      <div className={styles.container}>
        <div className={styles.messageWrap}>
          <p className={styles.emptyState}>
            No evaluation data available yet.
          </p>
        </div>
      </div>
    );
  }

  const isFatal = evaluation.fatal === 'YES';
  const scores = evaluation.scores ?? {};
  const summary = evaluation.summary ?? {
    strengths: '',
    weaknesses: '',
    summary: '',
  };
  const fatalReasons = evaluation.fatal_reasons ?? [];

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <header className={styles.header}>

          <h1 className={styles.title}>Evaluation summary</h1>

          <div className={styles.fatalRow}>
            <span
              className={`${styles.badge} ${
                isFatal ? styles.fatal : styles.nonFatal
              }`}
              aria-label={isFatal ? 'Fatal' : 'Not fatal'}
            >
              {isFatal ? 'Fatal' : 'Not fatal'}
            </span>
          </div>

          {isFatal && fatalReasons.length > 0 && (
            <ul className={styles.fatalReasons}>
              {fatalReasons.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          )}
        </header>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Scores</h2>

          <div className={styles.scoresGrid}>
            {(Object.keys(SCORE_LABELS) as Array<
              keyof EvaluationType['scores']
            >).map((key) => {
              const value = scores[key];
              return (
                <div key={key} className={styles.scoreCard}>
                  <span className={styles.scoreLabel}>
                    {SCORE_LABELS[key]}
                  </span>
                  <span className={styles.scoreValue}>
                    {typeof value === 'number' ? value : emptyText}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Summary</h2>

          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Overall summary</div>
            <p
              className={`${styles.summaryText} ${
                !summary.summary?.trim() ? styles.empty : ''
              }`}
            >
              {summary.summary?.trim() || emptyText}
            </p>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Strengths</div>
            <p
              className={`${styles.summaryText} ${
                !summary.strengths?.trim() ? styles.empty : ''
              }`}
            >
              {summary.strengths?.trim() || emptyText}
            </p>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryLabel}>Weaknesses</div>
            <p
              className={`${styles.summaryText} ${
                !summary.weaknesses?.trim() ? styles.empty : ''
              }`}
            >
              {summary.weaknesses?.trim() || emptyText}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}