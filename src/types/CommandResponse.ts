export interface CommandResponse {
    version:    number;
    type:       number;
    token:      string;
    member:     Member;
    id:         string;
    guild_id:   string;
    data:       Data;
    channel_id: string;
}

export interface Data {
    name: string;
    id:   string;
    options: Option[];
}

export interface Option {
    value: string;
    name: string;
    options: Option[] | null;
}

export interface Member {
    user:          User;
    roles:         string[];
    premium_since: null;
    permissions:   string;
    pending:       boolean;
    nick:          null;
    mute:          boolean;
    joined_at:     string;
    is_pending:    boolean;
    deaf:          boolean;
}

export interface User {
    username:      string;
    public_flags:  number;
    id:            string;
    discriminator: string;
    avatar:        string;
}
