import { Link, useSearchParams } from 'react-router-dom';
import { Ink } from '../components/Ink';
import { ArrowUpRightIcon } from '../components/icons';
import { Page, useDocumentTitle } from '../components/page';
import { gameHref } from '../data/deployment';
import { display } from '../data/display-copy';
import { gsap, MOTION, stamp, useGSAP } from '../motion/gsap';
import '../styles/pages.css';

const methods = [
  {
    id: 'qr',
    text: '到集章點掃描 QR Code。QR Code 下方印有代碼，掃描不順時可直接在 App 輸入。',
  },
  { id: 'quiz', text: '讀完現場的說明，回答一題選擇題。答案都寫在說明裡，不會找不到。' },
  { id: 'photo', text: '在定點拍下指定的東西。集章成功後會出現這個地點的介紹。' },
] as const;

const signIns = [
  ['Portal', '校內教職員生，使用學校帳號'],
  ['Google', '校外參與者'],
  ['LINE', '校外參與者'],
] as const;

export default function PlayPage() {
  useDocumentTitle(display.pages.play);
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MOTION, () => {
      const list = document.querySelector('.seal-methods');
      if (list) stamp(gsap.utils.toArray('.seal-methods .seal'), list);
    });
    return () => mm.revert();
  });
  const [params] = useSearchParams();
  const href = gameHref(params.size ? `?${params}` : '');

  return (
    <Page
      title={display.pages.play}
      lede="第二屆的大地遊戲是走遍校園的實景集章。集章只在安裝到手機主畫面的松櫻祭 App 裡進行；請前往獨立的集章 App 安裝與開始。"
      className="play"
    >
      <p className="actions">
        {href ? (
          <a className="button" href={href}>
            前往集章 App
            <ArrowUpRightIcon size={16} weight="bold" aria-hidden="true" />
          </a>
        ) : (
          <span className="note">集章 App 網址尚未公布。</span>
        )}
      </p>
      <p className="note">集章 App 獨立提供安裝與遊戲；官網不需要安裝，也不儲存集章紀錄。</p>

      <section aria-labelledby="how-title">
        <h2 className="display section-title" id="how-title" data-ink>
          <Ink text={display.sections.howStamp} />
        </h2>
        {/* 印章: the three ways to collect, each pressed on as a seal. */}
        <ol className="seal-methods">
          {methods.map((method) => (
            <li key={method.id}>
              <span className="display seal" aria-hidden="true">
                {display.flows.seals[method.id]}
              </span>
              <h3>{{ qr: '掃碼集章', quiz: '問答集章', photo: '拍照集章' }[method.id]}</h3>
              <p>{method.text}</p>
            </li>
          ))}
        </ol>
        <p className="note">
          集章點的位置與題目待團隊確認。校園位置可先參考
          <Link className="text-link" to="/map">
            校園地圖
          </Link>
          。
        </p>
      </section>

      <section aria-labelledby="signin-title">
        <h2 className="display section-title" id="signin-title" data-ink>
          <Ink text={display.sections.signIn} />
        </h2>
        <p>登入只在 App 裡進行，官網不需要也不提供登入。預計支援：</p>
        <dl className="rows info-rows">
          {signIns.map(([name, who]) => (
            <div key={name}>
              <dt className="latin">{name}</dt>
              <dd>{who}</dd>
            </div>
          ))}
        </dl>
        <p className="note">登入服務尚未開放。遊戲原型的集章紀錄只存在使用 App 的裝置上。</p>
      </section>

      <section id="privacy" aria-labelledby="privacy-title">
        <h2 className="display section-title" id="privacy-title" data-ink>
          <Ink text={display.sections.privacy} />
        </h2>
        <ul className="rows">
          <li>照片只用來確認你完成了集章任務，不會用於其他用途或公開。</li>
          <li>請拍指定的物件或集章牌，避免拍到其他人的臉。</li>
          <li>如果照片裡不小心拍到人，該照片只供集章確認，不會另作使用。</li>
          <li>目前的版本不會上傳照片；照片留在你的手機上。</li>
        </ul>
        <p className="note">正式隱私權政策待主辦單位確認後公布。</p>
      </section>
    </Page>
  );
}
