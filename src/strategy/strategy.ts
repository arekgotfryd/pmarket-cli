export interface Strategy {
    execute(options:any): Promise<void>;
}