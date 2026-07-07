declare module 'multiple-cucumber-html-reporter' {
  interface ReportMetadata {
    browser: {
      name: string;
      version: string;
    };
    device: string;
    platform: {
      name: string;
    };
  }

  interface CustomDataItem {
    label: string;
    value: string;
  }

  interface GenerateOptions {
    jsonDir: string;
    reportPath: string;
    displayDuration?: boolean;
    pageTitle?: string;
    reportName?: string;
    metadata?: ReportMetadata;
    customData?: {
      title: string;
      data: CustomDataItem[];
    };
  }

  const reporter: {
    generate(options: GenerateOptions): void;
  };

  export default reporter;
}
