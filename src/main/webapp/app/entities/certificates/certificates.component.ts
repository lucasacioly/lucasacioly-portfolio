import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { PrimengModule } from 'app/shared/primeng/primeng.module';
import { CERTIFICATE_ASSETS } from './certificates.assets';

interface CertificateCard {
  id: string;
  title: string;
  issuer: string;
  category: string;
  issueDate: string;
  year: string;
  fileName: string;
  filePath: string;
  description: string;
  pdfUrl: string;
  actualPdfUrl: string;
  previewUrl: SafeResourceUrl;
  sortKey: string;
}

interface CertificateGroup {
  key: string;
  label: string;
  certificates: CertificateCard[];
  collapsed?: boolean;
}

@Component({
  selector: 'jhi-certificates',
  standalone: true,
  imports: [PrimengModule],
  templateUrl: './certificates.component.html',
  styleUrl: './certificates.component.scss',
})
export class CertificatesComponent implements OnInit {
  private static readonly CERTS_ROOT = 'content/images/certs/';
  private static readonly CARD_BG_CLASSES = [
    'bg-slate-900',
    'bg-blue-950',
    'bg-cyan-950',
    'bg-emerald-950',
    'bg-indigo-950',
    'bg-teal-950',
  ] as const;

  certificates: CertificateCard[] = [];
  certificateGroups: CertificateGroup[] = [];
  selectedCertificate?: CertificateCard;
  dialogVisible = false;

  constructor(
    private readonly sanitizer: DomSanitizer,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    this.certificates = this.loadCertificates();
    this.certificateGroups = this.groupCertificates(this.certificates);
    this.selectedCertificate = this.certificates[0];
    this.handleUrlPath();
  }

  private handleUrlPath(): void {
    const url = window.location.hash.replace('#', '');
    const certsMatch = url.match(/\/certs\/(.+)/);
    if (!certsMatch) {
      return;
    }
    const requestedPath = certsMatch[1];
    const found = this.certificates.find(c => c.id === requestedPath);
    if (found) {
      this.selectedCertificate = found;
    }
  }

  openCertificate(certificate: CertificateCard): void {
    this.selectedCertificate = certificate;
    this.dialogVisible = true;
  }

  closeDialog(): void {
    this.dialogVisible = false;
  }

  trackByGroup(_: number, group: CertificateGroup): string {
    return group.key;
  }

  trackByCertificate(_: number, certificate: CertificateCard): string {
    return certificate.id;
  }

  cardBackgroundClass(cardId: string): string {
    let hash = 0;

    for (let index = 0; index < cardId.length; index += 1) {
      hash = (hash * 31 + cardId.charCodeAt(index)) % 2147483647;
    }

    return CertificatesComponent.CARD_BG_CLASSES[hash % CertificatesComponent.CARD_BG_CLASSES.length];
  }

  private loadCertificates(): CertificateCard[] {
    const certificates = CERTIFICATE_ASSETS.map(assetPath => this.buildCertificateCard(assetPath));

    return certificates.sort(
      (left: CertificateCard, right: CertificateCard) => right.sortKey.localeCompare(left.sortKey) || left.title.localeCompare(right.title),
    );
  }

  private groupCertificates(certificates: CertificateCard[]): CertificateGroup[] {
    const groups = new Map<string, CertificateGroup>();

    certificates.forEach(certificate => {
      const groupKey = certificate.category;
      const currentGroup = groups.get(groupKey);

      if (currentGroup) {
        currentGroup.certificates.push(certificate);
        return;
      }

      groups.set(groupKey, {
        key: groupKey,
        label: this.formatFolderLabel(groupKey),
        certificates: [certificate],
        collapsed: false,
      });
    });

    return Array.from(groups.values());
  }

  toggleGroup(group: CertificateGroup): void {
    group.collapsed = !group.collapsed;
  }

  private buildCertificateCard(assetPath: string): CertificateCard {
    const filePath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
    const certRelativePath = filePath.startsWith(CertificatesComponent.CERTS_ROOT)
      ? filePath.slice(CertificatesComponent.CERTS_ROOT.length)
      : filePath;
    const fileName = certRelativePath.split('/').pop() ?? certRelativePath;
    const category = certRelativePath.includes('/') ? certRelativePath.split('/').slice(0, -1).join('/') : 'raiz';
    const baseName = fileName.replace(/\.pdf$/i, '');
    const metadata = this.parseFileName(baseName, category);
    const actualUrl = `/${filePath}`;
    const pdfUrl = `#/certs/${certRelativePath}`;

    return {
      id: certRelativePath,
      title: metadata.title,
      issuer: metadata.issuer,
      category,
      issueDate: metadata.issueDate,
      year: metadata.year,
      fileName,
      filePath: certRelativePath,
      description: metadata.description,
      pdfUrl,
      actualPdfUrl: actualUrl,
      previewUrl: this.sanitizer.bypassSecurityTrustResourceUrl(actualUrl),
      sortKey: metadata.sortKey,
    };
  }

  private parseFileName(
    baseName: string,
    category: string,
  ): {
    title: string;
    issuer: string;
    issueDate: string;
    year: string;
    description: string;
    sortKey: string;
  } {
    const normalized = baseName.replace(/_/g, '-');
    const dateMatch = normalized.match(/^(\d{8})-(.+)$/);
    const rawDate = dateMatch?.[1] ?? '';
    const datePart = rawDate ? this.formatDate(rawDate) : '';
    const year = rawDate ? rawDate.slice(0, 4) : 's/ano';
    const remainder = dateMatch?.[2] ?? normalized;
    const tokens = remainder.split('-').filter(Boolean);
    const hasHashSuffix = tokens.length > 1 && /^[a-f0-9]{6,}$/i.test(tokens[tokens.length - 1]);
    const titleTokens = hasHashSuffix ? tokens.slice(0, -1) : tokens;
    const title = this.formatTitle(titleTokens.length > 0 ? titleTokens : [baseName]);
    const issuer = this.deriveIssuer(titleTokens, category, title);
    const categoryLabel = this.formatFolderLabel(category);
    const description = datePart
      ? `${issuer} - emitido em ${datePart}. Arquivo organizado em ${categoryLabel}.`
      : `${issuer} - arquivo organizado em ${categoryLabel}.`;

    return {
      title,
      issuer,
      issueDate: datePart || 'Data não informada',
      year,
      description,
      sortKey: `${rawDate || '00000000'}-${title.toLowerCase()}`,
    };
  }

  private formatTitle(tokens: string[]): string {
    return tokens
      .map(token => this.humanizeToken(token))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private deriveIssuer(tokens: string[], category: string, fallback: string): string {
    if (category !== 'raiz') {
      return this.formatFolderLabel(category);
    }

    if (tokens.length > 1) {
      return this.humanizeToken(tokens[tokens.length - 1]);
    }

    return fallback || 'Certificado';
  }

  private formatFolderLabel(category: string): string {
    if (!category || category === 'raiz') {
      return 'Raiz';
    }

    return category
      .split('/')
      .map(part => this.humanizeToken(part))
      .join(' / ');
  }

  private humanizeToken(token: string): string {
    const normalized = token.replace(/_/g, ' ').replace(/\s+/g, ' ').trim();

    if (/^[A-Z0-9]{2,10}$/.test(normalized)) {
      return normalized;
    }

    return normalized
      .split(' ')
      .filter(Boolean)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');
  }

  private formatDate(rawDate: string): string {
    const year = Number(rawDate.slice(0, 4));
    const month = Number(rawDate.slice(4, 6)) - 1;
    const day = Number(rawDate.slice(6, 8));
    const parsedDate = new Date(year, month, day);

    return Number.isNaN(parsedDate.getTime()) ? rawDate : parsedDate.toLocaleDateString('pt-BR');
  }
}
